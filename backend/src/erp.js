/**
 * erp.js — ERPNext REST client for Doppelherz / THG 4 Pharma
 *
 * Responsibilities:
 *  - Thin authenticated HTTP wrapper around the ERPNext REST API
 *  - Customer upsert (find-or-create) + address upsert
 *  - Sales Order creation (Draft)
 *  - Sales Order status poll (for tracking sync)
 *  - Item-code allowlist enforced at every call-site
 *
 * Design principles (borrowed from openclaw/database/erp.js):
 *  - No hardcoded credentials — all config from env
 *  - Strict item-code allowlist; unknown codes are rejected server-side
 *  - Input sanitized before every ERP call
 *  - Every ERP call has a hard 15 s timeout
 *  - Returns { ok, ...} consistently — never throws to callers
 */

import dotenv from 'dotenv';
import { normalizePhone } from './security.js';
dotenv.config();

// ── Configuration ──────────────────────────────────────────────────────────

const BASE_URL = (process.env.ERP_URL || '').replace(/\/+$/, '');
const API_KEY   = process.env.ERP_KEY   || '';
const API_SECRET = process.env.ERP_SECRET || '';
const ERP_COMPANY = process.env.ERP_COMPANY || 'Zabbtnalk';

// Map our internal product IDs → ERPNext item codes
export const PRODUCT_TO_ERP_CODE = {
  'pure-3':        'DH-PURE3-001',
  'collagen-1000': 'DH-COLL-001',
  'belle-hairnakin':'DH-BELLE-001',
  'iron-direct':   'DH-IRON-001',
  'vital-materna': 'DH-MATERNA-001',
  'diavit':        'DH-DIAVIT-001',
};

// Reverse map: ERP code → our product ID
export const ERP_CODE_TO_PRODUCT = Object.fromEntries(
  Object.entries(PRODUCT_TO_ERP_CODE).map(([k, v]) => [v, k])
);

// Hard allowlist — enforced at every handler, belt-and-braces
const ALLOWED_ITEM_CODES = new Set(Object.values(PRODUCT_TO_ERP_CODE));

// ── ERP Status → our order status mapping ──────────────────────────────────
// ERPNext Sales Order statuses: Draft, To Deliver and Bill, To Bill,
// To Deliver, Completed, Cancelled, On Hold
export function mapErpStatusToLocal(erpStatus) {
  if (!erpStatus) return null;
  const s = erpStatus.toLowerCase();
  if (s === 'draft')                          return 'confirmed';
  if (s.includes('to deliver and bill'))      return 'in_transit';
  if (s.includes('to deliver'))               return 'in_transit';
  if (s.includes('to bill'))                  return 'out_for_delivery';
  if (s === 'completed')                      return 'delivered';
  if (s === 'cancelled')                      return 'cancelled';
  if (s === 'on hold')                        return 'quality_check';
  return null; // unknown — don't overwrite our local status
}

// ── Helpers ────────────────────────────────────────────────────────────────

function isConfigured() {
  return BASE_URL && API_KEY && API_SECRET;
}

function cleanInput(text, maxLen = 200) {
  if (!text) return '';
  return String(text)
    .replace(/[^\x20-\x7E\u0600-\u06FF\u2013\u2014]/g, '')
    .substring(0, maxLen);
}

// ── Core HTTP wrapper ──────────────────────────────────────────────────────

async function erpRequest(method, resourcePath, params = null, body = null) {
  if (!isConfigured()) {
    return { ok: false, error: 'ERP not configured — set ERP_URL, ERP_KEY, ERP_SECRET in .env' };
  }

  let url = BASE_URL + resourcePath;
  if (params) {
    url += '?' + new URLSearchParams(params).toString();
  }

  try {
    const options = {
      method,
      headers: {
        'Authorization': `token ${API_KEY}:${API_SECRET}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return { ok: false, error: `ERP HTTP ${response.status}: ${errText.substring(0, 200)}` };
    }
    if (response.status === 204) return { ok: true, data: {} };

    const text = await response.text();
    let data = {};
    if (text) {
      try { data = JSON.parse(text); } catch (_) { /* non-JSON body */ }
    }
    return { ok: true, data };
  } catch (e) {
    const msg = e.message || String(e);
    if (e.name === 'TimeoutError' || msg.includes('timeout')) {
      return { ok: false, error: 'ERP request timed out' };
    }
    if (msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND') || msg.includes('fetch')) {
      return { ok: false, error: `Cannot reach ERP system: ${msg}` };
    }
    return { ok: false, error: `ERP unexpected error: ${msg}` };
  }
}

// ── Customer ───────────────────────────────────────────────────────────────

/**
 * Find existing ERP customer by phone.
 * Returns { ok, found, customer_id, customer_name } or { ok: false, error }
 */
export async function findCustomer(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return { ok: false, error: 'Invalid phone number' };

  const res = await erpRequest('GET', '/api/resource/Customer', {
    filters: JSON.stringify([['mobile_no', '=', normalized]]),
    fields: JSON.stringify(['name', 'customer_name', 'mobile_no']),
    limit: 1,
  });
  if (!res.ok) return res;

  const rows = res.data?.data || [];
  if (rows.length === 0) return { ok: true, found: false };
  return {
    ok: true,
    found: true,
    customer_id: rows[0].name,
    customer_name: rows[0].customer_name || '',
    phone: rows[0].mobile_no || '',
  };
}

/**
 * Find-or-create ERP customer.
 * Returns { ok, customer_id, customer_name, created }
 */
export async function upsertCustomer(name, phone) {
  const cleanName  = cleanInput(name, 100);
  const normalized = normalizePhone(phone);

  if (cleanName.length < 2) return { ok: false, error: 'Customer name too short' };
  if (!normalized)           return { ok: false, error: 'Invalid phone number' };

  // Try to find first
  const found = await findCustomer(normalized);
  if (!found.ok) return found;

  if (found.found) {
    return { ok: true, customer_id: found.customer_id, customer_name: found.customer_name, created: false };
  }

  // Create new customer
  const res = await erpRequest('POST', '/api/resource/Customer', null, {
    customer_name: cleanName,
    mobile_no: normalized,
    customer_type: 'Individual',
    customer_group: 'Online Store',
  });
  if (!res.ok) return res;

  return {
    ok: true,
    customer_id: res.data?.data?.name,
    customer_name: cleanName,
    created: true,
  };
}

// ── Address ────────────────────────────────────────────────────────────────

/**
 * Find existing shipping address linked to a customer.
 * Returns { ok, found, address_id } or { ok: false, error }
 */
export async function findCustomerAddress(customerId) {
  const id = cleanInput(customerId, 100);
  if (!id) return { ok: false, error: 'Customer ID required' };

  const res = await erpRequest('GET', '/api/resource/Address', {
    filters: JSON.stringify([
      ['links.link_name', '=', id],
      ['links.link_doctype', '=', 'Customer'],
    ]),
    fields: JSON.stringify(['name', 'address_line1', 'city']),
    limit: 1,
  });
  if (!res.ok) return res;

  const rows = res.data?.data || [];
  if (rows.length === 0) return { ok: true, found: false };
  return { ok: true, found: true, address_id: rows[0].name };
}

/**
 * Create a shipping address linked to a customer in ERP.
 * Returns { ok, address_id } or { ok: false, error }
 */
export async function createAddress(customerId, addressLine, city) {
  const id   = cleanInput(customerId, 100);
  const addr = cleanInput(addressLine, 300);
  const cty  = cleanInput(city, 100) || 'Cairo';

  if (!id)           return { ok: false, error: 'Customer ID required' };
  if (addr.length < 3) return { ok: false, error: 'Address too short' };

  const res = await erpRequest('POST', '/api/resource/Address', null, {
    address_title: `Shipping — ${id}`,
    address_type: 'Shipping',
    address_line1: addr,
    city: cty,
    links: [{ link_doctype: 'Customer', link_name: id }],
  });
  if (!res.ok) return res;

  return { ok: true, address_id: res.data?.data?.name };
}

/**
 * Find-or-create shipping address for a customer.
 */
export async function upsertAddress(customerId, addressLine, city) {
  const found = await findCustomerAddress(customerId);
  if (!found.ok) return found;
  if (found.found) return { ok: true, address_id: found.address_id, created: false };
  const created = await createAddress(customerId, addressLine, city);
  if (!created.ok) return created;
  return { ok: true, address_id: created.address_id, created: true };
}

// ── Sales Order ────────────────────────────────────────────────────────────

/**
 * Push a web order into ERPNext as a Draft Sales Order.
 *
 * @param {object} opts
 *   customerId  — ERP customer name (e.g. "CUST-0001")
 *   addressId   — ERP address name (e.g. "ADDR-0001")
 *   items       — [{ productId, name, qty, price }]  (our internal IDs)
 *   deliveryDate — ISO date string YYYY-MM-DD (optional, defaults to today+2)
 *
 * Returns { ok, erp_order_id } or { ok: false, error }
 */
export async function createErpOrder(opts) {
  const { customerId, addressId, items, deliveryDate } = opts;

  if (!customerId) return { ok: false, error: 'Customer ID required' };
  if (!addressId)  return { ok: false, error: 'Address ID required' };

  // Delivery date — default today + 2
  let date = deliveryDate;
  if (!date) {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    date = d.toISOString().split('T')[0];
  }

  // Map our product IDs → ERP item codes + validate
  const erpItems = [];
  for (const item of (items || [])) {
    const itemCode = PRODUCT_TO_ERP_CODE[item.productId];
    if (!itemCode) {
      return { ok: false, error: `Unknown product ID: ${item.productId}` };
    }
    if (!ALLOWED_ITEM_CODES.has(itemCode)) {
      return { ok: false, error: `Item not in catalog: ${itemCode}` };
    }
    const qty  = Number(item.qty || item.quantity || 1);
    const rate = Number(item.price || 0);
    if (!qty || qty <= 0 || qty > 1000) {
      return { ok: false, error: `Invalid qty for ${item.productId}` };
    }
    if (!rate || rate <= 0 || rate > 1_000_000) {
      return { ok: false, error: `Invalid price for ${item.productId}` };
    }
    erpItems.push({ item_code: itemCode, qty, rate });
  }

  if (erpItems.length === 0) return { ok: false, error: 'No valid items' };
  if (erpItems.length > 20)  return { ok: false, error: 'Max 20 items per order' };

  const res = await erpRequest('POST', '/api/resource/Sales Order', null, {
    company: ERP_COMPANY,
    customer: customerId,
    delivery_date: date,
    shipping_address_name: addressId,
    items: erpItems,
  });
  if (!res.ok) return res;

  const order = res.data?.data || {};
  return {
    ok: true,
    erp_order_id: order.name,
    grand_total: order.grand_total,
    currency: order.currency || 'EGP',
  };
}

/**
 * Fetch ERP Sales Order status by ERP order ID.
 * Returns { ok, erp_status, local_status } or { ok: false, error }
 */
export async function getErpOrderStatus(erpOrderId) {
  const id = cleanInput(erpOrderId, 100);
  if (!id) return { ok: false, error: 'ERP order ID required' };

  const res = await erpRequest('GET', `/api/resource/Sales Order/${encodeURIComponent(id)}`);
  if (!res.ok) return res;

  const order = res.data?.data || {};
  const erpStatus = order.status || '';
  const localStatus = mapErpStatusToLocal(erpStatus);

  return {
    ok: true,
    erp_order_id: id,
    erp_status: erpStatus,
    local_status: localStatus,
    delivery_date: order.delivery_date || null,
    grand_total: order.grand_total || null,
  };
}

export { isConfigured };
