/**
 * erpSync.js — Background ERP sync worker
 *
 * Flow per order:
 *  1. Web checkout → order saved to MySQL (our tracking # issued immediately)
 *  2. A row is inserted into `erp_sync_queue` (status = pending)
 *  3. This worker polls the queue every POLL_INTERVAL_MS
 *  4. For each pending/retrying row it:
 *       a. Upserts the customer in ERP
 *       b. Upserts the shipping address in ERP
 *       c. Creates a Draft Sales Order in ERP
 *       d. Saves the ERP order ID back into `orders.erp_order_id`
 *          and marks the queue row as `synced`
 *  5. A second loop (STATUS_POLL_INTERVAL_MS) polls ERP for status
 *     updates on already-synced orders that aren't yet delivered/cancelled,
 *     and updates `orders.status` accordingly.
 *
 * Retry policy:
 *  - Up to MAX_ATTEMPTS attempts with exponential back-off (capped at 1 h)
 *  - After MAX_ATTEMPTS the row is marked `failed` and the operator is
 *    alerted via console.error (hook a pager/email here in production)
 *
 * Security:
 *  - All ERP calls go through erp.js which enforces the item-code allowlist
 *  - No customer-supplied data is executed as SQL — only parameterised queries
 *  - The worker never exposes ERP credentials to the API layer
 */

import { getDb } from './db.js';
import {
  upsertCustomer,
  upsertAddress,
  createErpOrder,
  getErpOrderStatus,
  isConfigured,
} from './erp.js';
import { notifyOrderCreated } from './orderNotify.js';

// ── Tunables ──────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS        = 60_000;   // push-sync: every 60 s
const STATUS_POLL_INTERVAL_MS = 5 * 60_000; // status-sync: every 5 min
const MAX_ATTEMPTS            = 8;
// Exponential back-off cap: 2^7 * 60 s ≈ 128 min, capped at 60 min
const BACKOFF_CAP_S           = 3600;

function backoffSeconds(attempt) {
  return Math.min(Math.pow(2, attempt) * 60, BACKOFF_CAP_S);
}

// ── Push sync loop ─────────────────────────────────────────────────────────

async function processPendingQueue() {
  const pool = getDb();
  if (!pool) return;
  if (!isConfigured()) return; // ERP env vars not set yet

  let rows;
  try {
    [rows] = await pool.query(
      `SELECT q.id, q.order_id, q.attempts,
              o.tracking_number, o.customer_name, o.phone, o.whatsapp_phone,
              o.address, o.governorate, o.notes
       FROM erp_sync_queue q
       JOIN orders o ON o.id = q.order_id
       WHERE q.status IN ('pending', 'retrying')
         AND (q.next_attempt_at IS NULL OR q.next_attempt_at <= NOW())
       ORDER BY q.created_at ASC
       LIMIT 10`
    );
  } catch (e) {
    console.error('[ERP Sync] Queue query failed:', e.message);
    return;
  }

  for (const row of rows) {
    await syncOneOrder(pool, row);
  }
}

async function syncOneOrder(pool, row) {
  const { id: queueId, order_id, attempts, tracking_number,
          customer_name, phone, whatsapp_phone, address, governorate } = row;

  // Mark as in-progress to avoid double-processing on next tick
  try {
    await pool.query(
      `UPDATE erp_sync_queue SET status = 'processing', attempts = attempts + 1, last_error = NULL
       WHERE id = ?`,
      [queueId]
    );
  } catch (e) {
    return; // DB issue — skip this row
  }

  try {
    // 1. Fetch the full order items
    const [items] = await pool.query(
      `SELECT product_id, product_name, quantity, unit_price FROM order_items WHERE order_id = ?`,
      [order_id]
    );

    // 2. Upsert customer
    const custResult = await upsertCustomer(customer_name, phone);
    if (!custResult.ok) throw new Error(`Customer upsert failed: ${custResult.error}`);

    // 3. Upsert address
    const addrResult = await upsertAddress(custResult.customer_id, address, governorate);
    if (!addrResult.ok) throw new Error(`Address upsert failed: ${addrResult.error}`);

    // 4. Build items list
    const erpItems = items.map(i => ({
      productId: i.product_id,
      name: i.product_name,
      qty: i.quantity,
      price: i.unit_price,
    }));

    // 5. Create Sales Order in ERP
    const orderResult = await createErpOrder({
      customerId: custResult.customer_id,
      addressId:  addrResult.address_id,
      items:      erpItems,
    });
    if (!orderResult.ok) throw new Error(`Order creation failed: ${orderResult.error}`);

    const erpOrderId = orderResult.erp_order_id;

    // 6. Persist ERP order ID into main orders table
    await pool.query(
      `UPDATE orders SET erp_order_id = ?, erp_synced_at = NOW(), erp_sync_error = NULL
       WHERE id = ?`,
      [erpOrderId, order_id]
    );

    // 7. Mark queue row as done
    await pool.query(
      `UPDATE erp_sync_queue
       SET status = 'synced', erp_order_id = ?, synced_at = NOW(), last_error = NULL
       WHERE id = ?`,
      [erpOrderId, queueId]
    );

    console.log(`[ERP Sync] OK: ${tracking_number} -> ERP ${erpOrderId}`);

    // Notify team via WhatsApp notification service (/order-notify) with ERP order ID
    notifyOrderCreated({
      erp_order_id:     erpOrderId,
      tracking_number:  tracking_number,
      customer_name,
      customer_phone:   phone,
      whatsapp_phone:   whatsapp_phone || phone,
      shipping_address: `${address}, ${governorate}`,
      items:            erpItems,
      grand_total:      orderResult.grand_total,
      currency:         orderResult.currency || 'EGP',
      notes:            (row.notes || '') + (whatsapp_phone && whatsapp_phone !== phone ? ` [واتساب: ${whatsapp_phone}]` : ''),
    });

  } catch (err) {
    const errorMsg = err.message || String(err);
    const nextAttempt = attempts + 1;

    if (nextAttempt >= MAX_ATTEMPTS) {
      await pool.query(
        `UPDATE erp_sync_queue SET status = 'failed', last_error = ?, last_attempt_at = NOW()
         WHERE id = ?`,
        [errorMsg.substring(0, 500), queueId]
      );
      await pool.query(
        `UPDATE orders SET erp_sync_error = ? WHERE id = ?`,
        [errorMsg.substring(0, 500), order_id]
      );
      console.error(`[ERP Sync] FAILED permanently: ${tracking_number} after ${nextAttempt} attempts — ${errorMsg}`);
    } else {
      const delaySec = backoffSeconds(nextAttempt);
      await pool.query(
        `UPDATE erp_sync_queue
         SET status = 'retrying', last_error = ?, last_attempt_at = NOW(),
             next_attempt_at = DATE_ADD(NOW(), INTERVAL ? SECOND)
         WHERE id = ?`,
        [errorMsg.substring(0, 500), delaySec, queueId]
      );
      console.warn(`[ERP Sync] Retry ${nextAttempt}/${MAX_ATTEMPTS} for ${tracking_number} in ${delaySec}s — ${errorMsg}`);
    }
  }
}

// ── Status sync loop ───────────────────────────────────────────────────────
// Polls ERP for status updates on orders already synced but not yet terminal.

const TERMINAL_STATUSES = new Set(['delivered', 'cancelled']);

async function pollErpStatuses() {
  const pool = getDb();
  if (!pool) return;
  if (!isConfigured()) return;

  let rows;
  try {
    // Only poll orders that have an ERP ID and aren't in a terminal status yet
    [rows] = await pool.query(
      `SELECT id, tracking_number, erp_order_id, status
       FROM orders
       WHERE erp_order_id IS NOT NULL
         AND status NOT IN ('delivered', 'cancelled')
       ORDER BY erp_synced_at ASC
       LIMIT 50`
    );
  } catch (e) {
    console.error('[ERP Status] Query failed:', e.message);
    return;
  }

  for (const row of rows) {
    try {
      const result = await getErpOrderStatus(row.erp_order_id);
      if (!result.ok) continue; // ERP temporarily unreachable — skip silently

      const localStatus = result.local_status;
      if (!localStatus) continue; // Unmapped ERP status — don't touch our status

      if (localStatus !== row.status && !TERMINAL_STATUSES.has(row.status)) {
        await pool.query(
          `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
          [localStatus, row.id]
        );
        console.log(`[ERP Status] ${row.tracking_number}: ${row.status} -> ${localStatus} (ERP: ${result.erp_status})`);
      }
    } catch (e) {
      // Non-fatal — log and continue with next order
      console.warn(`[ERP Status] Error polling ${row.erp_order_id}: ${e.message}`);
    }
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Enqueue a newly-created order for ERP sync.
 * Called by server.js immediately after order insert — fire-and-forget.
 */
export async function enqueueOrder(orderId) {
  const pool = getDb();
  if (!pool) return;
  try {
    await pool.query(
      `INSERT IGNORE INTO erp_sync_queue (order_id, status, created_at)
       VALUES (?, 'pending', NOW())`,
      [orderId]
    );
  } catch (e) {
    console.error('[ERP Sync] Failed to enqueue order:', e.message);
  }
}

/**
 * Start both background loops.
 * Call once from server.js after DB is initialised.
 */
export function startErpSync() {
  if (!isConfigured()) {
    console.warn('[ERP Sync] ERP_URL / ERP_KEY / ERP_SECRET not set — ERP sync disabled.');
    return;
  }

  console.log('[ERP Sync] Starting push-sync loop (every 60 s) and status-poll loop (every 5 min)');

  // Run once immediately on startup to catch anything that survived a restart
  processPendingQueue().catch(e => console.error('[ERP Sync] Startup push error:', e.message));
  pollErpStatuses().catch(e => console.error('[ERP Sync] Startup status error:', e.message));

  setInterval(() => {
    processPendingQueue().catch(e => console.error('[ERP Sync] Push error:', e.message));
  }, POLL_INTERVAL_MS);

  setInterval(() => {
    pollErpStatuses().catch(e => console.error('[ERP Sync] Status error:', e.message));
  }, STATUS_POLL_INTERVAL_MS);
}
