import { UAParser } from 'ua-parser-js';

/**
 * Canonical Egyptian phone normalizer.
 *
 * Accepts any of the common formats a customer might type:
 *   01XXXXXXXXX        (local 11-digit)
 *   1XXXXXXXXXX        (local without leading 0 — 10 digit)
 *   201XXXXXXXXX       (E.164 without +)
 *   +201XXXXXXXXX      (full E.164)
 *   00201XXXXXXXXX     (IDD prefix)
 *   002001XXXXXXXXX    (double-country prefix typo)
 *
 * Always returns the canonical LOCAL form: 01XXXXXXXXX
 * Returns '' if the input cannot be recognized as an Egyptian mobile number.
 *
 * This function is the single source of truth used by:
 *   - POST /api/orders/track   (ownership check)
 *   - ERP customer upsert      (erp.js)
 *   - WhatsApp agent MCP       (passes phone from conversation)
 *   - CLI operator tools       (search)
 */
export function normalizePhone(raw) {
  if (!raw) return '';
  // Strip everything except digits and leading +
  const stripped = String(raw).replace(/[\s\-().]/g, '');
  let digits = stripped.replace(/\D/g, '');

  // 002001XXXXXXXX (15 digits)
  if (digits.startsWith('002001') && digits.length === 15) digits = digits.slice(4);
  // 00201XXXXXXXX (14 digits)
  else if (digits.startsWith('00201') && digits.length === 14) digits = '0' + digits.slice(4);
  // 2001XXXXXXXX (13 digits)
  else if (digits.startsWith('2001') && digits.length === 13) digits = digits.slice(2);
  // 201XXXXXXXXX (12 digits) — E.164 without +
  else if (digits.startsWith('20') && digits.length === 12) digits = '0' + digits.slice(2);
  // 1XXXXXXXXXX (10 digits) — missing leading 0
  else if (digits.length === 10 && /^1[0125]/.test(digits)) digits = '0' + digits;

  // Validate: must now be 01[0125]XXXXXXXX
  if (/^01[0125][0-9]{8}$/.test(digits)) return digits;
  return '';
}

/**
 * Extracts the real client IP address, handling proxies, Cloudflare, Vercel, and Nginx.
 */
export function getClientIp(req) {
  // Cloudflare
  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp) return String(cfIp).trim();

  // Nginx / Reverse proxies
  const realIp = req.headers['x-real-ip'];
  if (realIp) return String(realIp).trim();

  // Standard Forwarded For
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = String(forwardedFor).split(',');
    if (ips.length > 0 && ips[0].trim()) {
      return ips[0].trim();
    }
  }

  // Socket fallback
  const socketIp = req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
  // Strip IPv6 prefix if IPv4 mapped
  return socketIp.replace(/^::ffff:/, '');
}

/**
 * Parses user-agent to extract device type, model, OS, and browser.
 */
export function parseClientDevice(userAgentString = '') {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  const device = result.device;
  const os = result.os;
  const browser = result.browser;

  // Determine device type
  let deviceType = device.type || 'desktop';
  if (/mobile/i.test(userAgentString) && !device.type) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(userAgentString) && !device.type) {
    deviceType = 'tablet';
  }

  // Determine device model
  let deviceModel = '';
  if (device.vendor || device.model) {
    deviceModel = [device.vendor, device.model].filter(Boolean).join(' ');
  } else if (/iPhone/i.test(userAgentString)) {
    deviceModel = 'Apple iPhone';
  } else if (/iPad/i.test(userAgentString)) {
    deviceModel = 'Apple iPad';
  } else if (/Android/i.test(userAgentString)) {
    deviceModel = 'Android Device';
  } else if (/Windows/i.test(userAgentString)) {
    deviceModel = 'Windows PC';
  } else if (/Macintosh/i.test(userAgentString)) {
    deviceModel = 'Apple Mac';
  } else {
    deviceModel = 'Generic Device';
  }

  return {
    deviceType,
    deviceModel,
    osName: os.name || 'Unknown OS',
    osVersion: os.version || '',
    browserName: browser.name || 'Unknown Browser',
    browserVersion: browser.version || '',
  };
}

/**
 * Calculates a fraud / risk score based on client behavior and heuristics.
 */
export function evaluateOrderRisk({
  ip,
  phone,
  userAgent = '',
  items = [],
  customerName = '',
  total = 0,
}) {
  let riskScore = 0;
  const flags = [];

  // 1. Missing or suspicious User-Agent (typical of scripted bots / automated curl)
  if (!userAgent || userAgent.length < 15) {
    riskScore += 40;
    flags.push('SUSPICIOUS_OR_EMPTY_USER_AGENT');
  } else if (/curl|python|wget|postman|insomnia|headless|bot|crawl|spider/i.test(userAgent)) {
    riskScore += 70;
    flags.push('AUTOMATED_CLIENT_DETECTED');
  }

  // 2. Phone number format validation (must be valid Egyptian phone)
  const cleanPhone = String(phone).replace(/[\s\-()]/g, '');
  const isValidEg = /^(010|011|012|015)[0-9]{8}$|^(\+?20)(10|11|12|15)[0-9]{8}$/.test(cleanPhone);
  if (!isValidEg) {
    riskScore += 35;
    flags.push('INVALID_EGYPTIAN_PHONE_FORMAT');
  }

  // 3. Name sanity check
  if (!customerName || customerName.trim().length < 3 || /test|admin|asdf|qwerty|1234/i.test(customerName)) {
    riskScore += 25;
    flags.push('SUSPICIOUS_CUSTOMER_NAME');
  }

  // 4. Excessive items or quantity probe
  const totalQuantity = items.reduce((acc, item) => acc + (Number(item.qty || item.quantity) || 1), 0);
  if (totalQuantity > 15) {
    riskScore += 30;
    flags.push('EXCESSIVE_QUANTITY_PROBE');
  }

  // 5. Zero or negative price
  if (total <= 0) {
    riskScore += 60;
    flags.push('INVALID_OR_ZERO_TOTAL');
  }

  const isSuspicious = riskScore >= 50;

  return {
    riskScore,
    isSuspicious,
    flags,
  };
}
