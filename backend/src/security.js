import { UAParser } from 'ua-parser-js';

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
