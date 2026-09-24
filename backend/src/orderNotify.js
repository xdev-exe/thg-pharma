/**
 * orderNotify.js — Order Notification Dispatcher
 *
 * Sends order creation and ERP sync events to the local notification service
 * (e.g. OpenClaw agent / WhatsApp notifier running on http://localhost:3000/order-notify).
 *
 * Endpoints:
 *  - POST http://localhost:3000/order-notify (or ORDER_NOTIFY_URL from .env)
 *  - Optional Header: x-api-key: <ORDER_NOTIFY_SECRET>
 *
 * Resilience:
 *  - Fire-and-forget: failure to notify never blocks order creation or crashes the server
 *  - 10-second timeout
 *  - Flexible aliases matching the /order-notify specification
 */

import dotenv from 'dotenv';
dotenv.config();

const NOTIFY_URL    = process.env.ORDER_NOTIFY_URL || 'http://localhost:3000/order-notify';
const NOTIFY_SECRET = process.env.ORDER_NOTIFY_SECRET || '';

/**
 * Dispatch an order notification to the notification service.
 *
 * @param {object} payload
 *   tracking_number  — Store tracking code (e.g. THG-EG-123456)
 *   erp_order_id     — ERP Sales Order ID (e.g. SAL-ORD-2026-00001) [optional]
 *   customer_name    — Customer display name
 *   customer_phone   — Customer phone number
 *   shipping_address — Address and governorate
 *   delivery_date    — Scheduled delivery date (YYYY-MM-DD)
 *   items            — Array of { item_name, qty, rate }
 *   grand_total      — Total in EGP
 *   currency         — Default "EGP"
 *   notes            — Customer delivery notes
 */
export async function notifyOrderCreated(payload) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (NOTIFY_SECRET) {
      headers['x-api-key'] = NOTIFY_SECRET;
      headers['Authorization'] = `Bearer ${NOTIFY_SECRET}`;
    }

    const body = {
      erp_order_id:     payload.erp_order_id || null,
      tracking_number:  payload.tracking_number,
      customer_name:    payload.customer_name,
      customer_phone:   payload.customer_phone,
      whatsapp_phone:   payload.whatsapp_phone || payload.customer_phone,
      shipping_address: payload.shipping_address,
      delivery_date:    payload.delivery_date || null,
      items: (payload.items || []).map((i) => ({
        item_name: i.name || i.item_name || i.productName || 'منتج دوبل هيرز ألماني',
        qty:       Number(i.qty || i.quantity || 1),
        rate:      Number(i.price || i.rate || i.unit_price || 0),
      })),
      grand_total: Number(payload.grand_total || payload.total || 0),
      currency:    payload.currency || 'EGP',
      notes:       payload.notes || '',
    };

    const res = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000), // 10 s timeout
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      console.log(`[OrderNotify] Notification sent successfully for ${payload.tracking_number}:`, data.sentCount ? `${data.sentCount} recipients` : 'ok');
      return { ok: true, data };
    } else {
      const text = await res.text().catch(() => '');
      console.warn(`[OrderNotify] Server responded with HTTP ${res.status} for ${payload.tracking_number}: ${text.substring(0, 150)}`);
      return { ok: false, error: `HTTP ${res.status}` };
    }
  } catch (err) {
    // Non-blocking: log warning and continue safely
    console.warn(`[OrderNotify] Could not reach notification service at ${NOTIFY_URL} (${err.message}). Order was still saved safely.`);
    return { ok: false, error: err.message };
  }
}
