import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import dotenv from 'dotenv';
import { initDb, getDb } from './db.js';

dotenv.config();

const rl = readline.createInterface({ input, output });

// Prices are stored as whole EGP integers (e.g. 2000 = 2,000 EGP)
function formatMoney(amount) {
  return `${amount.toLocaleString('en-US')} EGP`;
}

// =========================================================================
// 1. Dashboard
// =========================================================================

async function showDashboard() {
  console.clear();
  const pool = getDb();

  console.log('====================================================');
  console.log('     DOPPELHERZ | MASTER OPERATOR DASHBOARD        ');
  console.log('====================================================\n');

  if (!pool) {
    console.log('ERROR: No database connection. Check your .env file.');
    return;
  }

  const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders');
  const [[{ totalRevenue }]] = await pool.query('SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders');
  const [[{ suspicious }]] = await pool.query('SELECT COUNT(*) AS suspicious FROM orders WHERE is_suspicious = 1');
  const [statusCounts] = await pool.query('SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status');

  console.log(`Total Orders:       ${totalOrders}`);
  console.log(`Total Gross Revenue: ${formatMoney(totalRevenue)}`);
  console.log(`Suspicious Orders:  ${suspicious}\n`);

  console.log('--- Orders by Status ---');
  for (const row of statusCounts) {
    console.log(`  * ${row.status.toUpperCase().padEnd(18)}: ${row.cnt}`);
  }

  const [[{ restockCount }]] = await pool.query('SELECT COUNT(*) AS restockCount FROM restock_interests');
  const [[{ auditCount }]] = await pool.query('SELECT COUNT(*) AS auditCount FROM security_audit_logs');

  console.log(`\nRestock Interests:  ${restockCount}`);
  console.log(`Security Audit Logs: ${auditCount}`);
  console.log('');
}

// =========================================================================
// 2. List Orders
// =========================================================================

async function listOrders() {
  console.log('\n--- LIST ORDERS ---');
  const pool = getDb();
  if (!pool) { console.log('ERROR: No database connection.'); return; }

  const search = await rl.question('Search by tracking #, phone, or name (ENTER for all): ');

  let rows;
  if (search.trim()) {
    const like = `%${search.trim()}%`;
    [rows] = await pool.query(
      `SELECT tracking_number, customer_name, phone, whatsapp_phone, governorate, total, status, is_suspicious, created_at
       FROM orders
       WHERE tracking_number LIKE ? OR phone LIKE ? OR whatsapp_phone LIKE ? OR customer_name LIKE ?
       ORDER BY id DESC LIMIT 25`,
      [like, like, like, like]
    );
  } else {
    [rows] = await pool.query(
      `SELECT tracking_number, customer_name, phone, whatsapp_phone, governorate, total, status, is_suspicious, created_at
       FROM orders ORDER BY id DESC LIMIT 25`
    );
  }

  if (rows.length === 0) {
    console.log('No orders found.\n');
    return;
  }

  const line = '-'.repeat(108);
  console.log(`\nFound ${rows.length} order(s):`);
  console.log(line);
  console.log('| Tracking #       | Customer Name            | Phone        | Total          | Status              | Suspicious |');
  console.log(line);
  for (const o of rows) {
    const track  = (o.tracking_number || '').padEnd(16);
    const name   = (o.customer_name || '').slice(0, 24).padEnd(24);
    const phone  = (o.phone || '').padEnd(12);
    const total  = formatMoney(o.total).padEnd(14);
    const status = (o.status || '').toUpperCase().padEnd(19);
    const susp   = o.is_suspicious ? 'YES' : 'NO ';
    console.log(`| ${track} | ${name} | ${phone} | ${total} | ${status} | ${susp}        |`);
  }
  console.log(line + '\n');
}

// =========================================================================
// 3. Inspect Order Detail
// =========================================================================

async function inspectOrder() {
  const pool = getDb();
  if (!pool) { console.log('ERROR: No database connection.'); return; }

  const tracking = await rl.question('\nEnter Tracking Number (e.g. THG-EG-123456): ');
  const [[order]] = await pool.query(
    `SELECT * FROM orders WHERE UPPER(tracking_number) = UPPER(?) LIMIT 1`,
    [tracking.trim()]
  );

  if (!order) {
    console.log('Order not found.\n');
    return;
  }

  const [items] = await pool.query(
    `SELECT product_id, product_name, quantity, unit_price, line_total FROM order_items WHERE order_id = ?`,
    [order.id]
  );

  console.log('\n====================================================');
  console.log(`ORDER DETAIL: ${order.tracking_number}`);
  console.log('====================================================');
  console.log(`Status:             ${order.status.toUpperCase()}`);
  console.log(`Customer:           ${order.customer_name}`);
  console.log(`Phone (Calls):      ${order.phone}`);
  console.log(`WhatsApp:           ${order.whatsapp_phone || order.phone}`);
  console.log(`Governorate:        ${order.governorate}`);
  console.log(`Address:            ${order.address}`);
  console.log(`Notes:              ${order.notes || 'None'}`);
  console.log(`Payment Method:     ${order.payment_method.toUpperCase()}`);
  console.log(`Subtotal:           ${formatMoney(order.subtotal)}`);
  console.log(`Discount:           ${formatMoney(order.discount)}`);
  console.log(`Shipping:           ${formatMoney(order.shipping)}`);
  console.log(`Total:              ${formatMoney(order.total)}`);
  console.log(`Est. Delivery:      ${order.estimated_delivery || 'N/A'}`);
  console.log(`Placed At:          ${new Date(order.created_at).toISOString()}`);

  console.log('\n--- Security Telemetry ---');
  console.log(`IP Address:         ${order.ip_address || 'N/A'}`);
  console.log(`Device Type:        ${order.device_type || 'N/A'}`);
  console.log(`Device Model:       ${order.device_model || 'N/A'}`);
  console.log(`OS:                 ${order.os_name || 'N/A'} ${order.os_version || ''}`);
  console.log(`Browser:            ${order.browser_name || 'N/A'} ${order.browser_version || ''}`);
  console.log(`Language:           ${order.client_language || 'N/A'}`);
  console.log(`Referrer:           ${order.referrer || 'None'}`);
  console.log(`Risk Score:         ${order.risk_score}`);
  console.log(`Suspicious:         ${order.is_suspicious ? 'YES' : 'NO'}`);
  console.log(`Risk Flags:         ${order.risk_flags || 'None'}`);

  console.log('\n--- Order Items ---');
  if (items.length === 0) {
    console.log('  (no items recorded)');
  }
  for (const item of items) {
    console.log(`  - ${item.quantity}x ${item.product_name} @ ${formatMoney(item.unit_price)} = ${formatMoney(item.line_total)} [ID: ${item.product_id}]`);
  }
  console.log('');
}

// =========================================================================
// 4. Update Order Status
// =========================================================================

async function updateOrderStatus() {
  const pool = getDb();
  if (!pool) { console.log('ERROR: No database connection.'); return; }

  const tracking = await rl.question('\nEnter Tracking Number: ');
  const [[order]] = await pool.query(
    `SELECT id, tracking_number, status FROM orders WHERE UPPER(tracking_number) = UPPER(?) LIMIT 1`,
    [tracking.trim()]
  );

  if (!order) {
    console.log('Order not found.\n');
    return;
  }

  console.log(`Current status: ${order.status.toUpperCase()}`);
  const nextStatus = await rl.question(
    'Enter new status (confirmed / quality_check / in_transit / out_for_delivery / delivered / cancelled): '
  );

  const validStatuses = ['confirmed', 'quality_check', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];
  const cleaned = nextStatus.trim().toLowerCase();

  if (!validStatuses.includes(cleaned)) {
    console.log(`Invalid status "${cleaned}". No change made.\n`);
    return;
  }

  await pool.query(
    `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
    [cleaned, order.id]
  );

  console.log(`Success! Order ${order.tracking_number} status updated: ${order.status.toUpperCase()} -> ${cleaned.toUpperCase()}\n`);
}

// =========================================================================
// 5. Suspicious Orders
// =========================================================================

async function viewSuspiciousOrders() {
  console.log('\n--- SUSPICIOUS ORDERS ---');
  const pool = getDb();
  if (!pool) { console.log('ERROR: No database connection.'); return; }

  const [rows] = await pool.query(
    `SELECT tracking_number, customer_name, phone, ip_address, risk_score, risk_flags, total, status, created_at
     FROM orders WHERE is_suspicious = 1 ORDER BY risk_score DESC, id DESC LIMIT 30`
  );

  if (rows.length === 0) {
    console.log('No suspicious orders flagged.\n');
    return;
  }

  console.log(`Found ${rows.length} suspicious order(s):\n`);
  for (const o of rows) {
    console.log(`* ${o.tracking_number} | ${o.customer_name} | ${o.phone} | IP: ${o.ip_address}`);
    console.log(`  Status: ${o.status.toUpperCase()} | Total: ${formatMoney(o.total)} | Risk Score: ${o.risk_score}`);
    console.log(`  Flags: ${o.risk_flags || 'N/A'}`);
    console.log(`  Placed: ${new Date(o.created_at).toISOString()}\n`);
  }
}

// =========================================================================
// 6. Restock Interests
// =========================================================================

async function viewRestockInterests() {
  console.log('\n--- RESTOCK NOTIFICATIONS ---');
  const pool = getDb();
  if (!pool) { console.log('ERROR: No database connection.'); return; }

  const [rows] = await pool.query(
    `SELECT product_id, product_name, contact, ip_address, notified, created_at
     FROM restock_interests ORDER BY id DESC LIMIT 30`
  );

  if (rows.length === 0) {
    console.log('No restock interests registered yet.\n');
    return;
  }

  console.log(`Found ${rows.length} restock interest(s):\n`);
  for (const r of rows) {
    const date    = new Date(r.created_at).toISOString().slice(0, 10);
    const notified = r.notified ? 'Notified' : 'Pending';
    console.log(`* ${date} | ${r.contact} -> ${r.product_name || r.product_id} [${notified}] (IP: ${r.ip_address || 'N/A'})`);
  }
  console.log('');
}

// =========================================================================
// 7. Security Audit Log
// =========================================================================

async function viewSecurityLog() {
  console.log('\n--- SECURITY AUDIT LOG ---');
  const pool = getDb();
  if (!pool) { console.log('ERROR: No database connection.'); return; }

  const [rows] = await pool.query(
    `SELECT event_type, ip_address, endpoint, action_taken, payload_summary, created_at
     FROM security_audit_logs ORDER BY id DESC LIMIT 30`
  );

  if (rows.length === 0) {
    console.log('No security events recorded.\n');
    return;
  }

  console.log(`Last ${rows.length} security event(s):\n`);
  for (const e of rows) {
    const ts = new Date(e.created_at).toISOString();
    console.log(`[${ts}] ${e.event_type} | IP: ${e.ip_address} | Endpoint: ${e.endpoint} | Action: ${e.action_taken}`);
    if (e.payload_summary) {
      console.log(`  Payload: ${e.payload_summary}`);
    }
  }
  console.log('');
}

// =========================================================================
// 8. ERP Sync Queue
// =========================================================================

async function viewErpSyncQueue() {
  console.log('\n--- ERP SYNC QUEUE ---');
  const pool = getDb();
  if (!pool) { console.log('ERROR: No database connection.'); return; }

  const [rows] = await pool.query(
    `SELECT q.id, q.status, q.attempts, q.erp_order_id, q.last_error,
            q.created_at, q.last_attempt_at, q.synced_at,
            o.tracking_number, o.customer_name, o.total
     FROM erp_sync_queue q
     JOIN orders o ON o.id = q.order_id
     ORDER BY q.id DESC LIMIT 40`
  );

  if (rows.length === 0) {
    console.log('ERP sync queue is empty.\n');
    return;
  }

  // Summary counts
  const counts = { pending: 0, processing: 0, retrying: 0, synced: 0, failed: 0 };
  for (const r of rows) counts[r.status] = (counts[r.status] || 0) + 1;
  console.log(`\nQueue summary: pending=${counts.pending} retrying=${counts.retrying} synced=${counts.synced} failed=${counts.failed}\n`);

  for (const r of rows) {
    const ts      = new Date(r.created_at).toISOString().slice(0, 16);
    const status  = r.status.toUpperCase().padEnd(10);
    const erp     = r.erp_order_id || '(not yet synced)';
    console.log(`[${ts}] ${status} | ${r.tracking_number} | ${r.customer_name} | ERP: ${erp} | Attempts: ${r.attempts}`);
    if (r.last_error) {
      console.log(`  Error: ${r.last_error}`);
    }
  }
  console.log('');

  console.log('Options:');
  console.log('  1. Retry a failed order now');
  console.log('  2. Return to menu');
  const sub = await rl.question('Enter option (1-2): ');

  if (sub.trim() === '1') {
    const tracking = await rl.question('Enter Tracking Number to retry: ');
    const [[order]] = await pool.query(
      `SELECT o.id FROM orders o WHERE UPPER(o.tracking_number) = UPPER(?) LIMIT 1`,
      [tracking.trim()]
    );
    if (!order) { console.log('Order not found.\n'); return; }

    const result = await pool.query(
      `UPDATE erp_sync_queue
       SET status = 'pending', next_attempt_at = NULL, last_error = NULL
       WHERE order_id = ? AND status IN ('failed', 'retrying')`,
      [order.id]
    );
    const affected = result[0].affectedRows;
    if (affected > 0) {
      console.log(`Queued for retry. The sync worker will pick it up within 60 seconds.\n`);
    } else {
      console.log(`No failed/retrying queue entry found for that order.\n`);
    }
  }
}

// =========================================================================
// Main loop
// =========================================================================

async function main() {
  console.log('Connecting to database...');
  await initDb();
  console.clear();

  while (true) {
    console.log('====================================================');
    console.log('     DOPPELHERZ | MASTER OPERATOR DASHBOARD        ');
    console.log('====================================================');
    console.log('1. View Dashboard & Overview');
    console.log('2. List Orders');
    console.log('3. Inspect Order Detail');
    console.log('4. Update Order Status');
    console.log('5. View Suspicious Orders');
    console.log('6. View Restock Interests');
    console.log('7. View Security Audit Log');
    console.log('8. ERP Sync Queue');
    console.log('9. Exit');
    console.log('====================================================');

    const choice = await rl.question('Enter choice (1-9): ');

    switch (choice.trim()) {
      case '1': await showDashboard();         break;
      case '2': await listOrders();            break;
      case '3': await inspectOrder();          break;
      case '4': await updateOrderStatus();     break;
      case '5': await viewSuspiciousOrders();  break;
      case '6': await viewRestockInterests();  break;
      case '7': await viewSecurityLog();       break;
      case '8': await viewErpSyncQueue();      break;
      case '9':
        console.log('\nGoodbye!');
        rl.close();
        const pool = getDb();
        if (pool) await pool.end();
        process.exit(0);
      default:
        console.log('Invalid choice.\n');
    }
  }
}

main().catch((err) => {
  console.error('Fatal CLI error:', err);
  process.exit(1);
});
