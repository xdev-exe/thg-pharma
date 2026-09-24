import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initDb, getDb, isDbConnected } from './db.js';
import { getClientIp, parseClientDevice, evaluateOrderRisk, normalizePhone } from './security.js';
import { enqueueOrder, startErpSync } from './erpSync.js';
import { upsertCustomer, upsertAddress, createErpOrder, getErpOrderStatus, isConfigured } from './erp.js';
import { notifyOrderCreated } from './orderNotify.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8877;

// Trust reverse proxies (Nginx, Cloudflare, Vercel, Docker)
app.set('trust proxy', 1);

// Prevent excessive payload denial of service attacks
app.use(express.json({ limit: '64kb' }));

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,https://thg4pharma.com')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or in whitelist
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for preview deployments
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// =========================================================================
// Rate Limiting Policies (DDoS, Brute Force & Fraud Defense)
// =========================================================================

// 1. Global API Limiter: 150 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please wait a few minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => getClientIp(req),
});

// 2. Strict Order Creation Limiter: max 8 orders per 15 minutes per IP
// Protects against automated script flooding, inventory holding attacks & spam
const orderCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many order attempts from this connection. Please try again after 15 minutes or contact our pharmacist on WhatsApp.',
    code: 'ORDER_RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => getClientIp(req),
  handler: async (req, res, next, options) => {
    const ip = getClientIp(req);
    console.warn(`[Security Alert] Order creation rate limit exceeded by IP: ${ip}`);
    
    // Log to security audit log if DB connected
    const pool = getDb();
    if (pool && isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO security_audit_logs (event_type, ip_address, endpoint, user_agent, action_taken)
           VALUES ('RATE_LIMIT_ORDER_FLOOD', ?, '/api/orders', ?, 'blocked')`,
          [ip, req.headers['user-agent'] || '']
        );
      } catch (e) {
        // ignore
      }
    }
    res.status(429).json(options.message);
  },
});

// 3. Tracking Lookup Limiter: max 40 lookups per 15 minutes per IP
// Protects against enumeration and phone number scraping
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many tracking queries. Please try again in a few minutes.',
    code: 'TRACKING_RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req) => getClientIp(req),
});

// 4. Restock Alert Limiter: max 12 requests per 15 minutes per IP
const restockLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment.',
  },
  keyGenerator: (req) => getClientIp(req),
});

app.use(globalLimiter);

// In-memory fallback if MySQL is not currently running
const memoryOrders = [];
const memoryRestock = [];
const memoryAuditLogs = [];

function generateTrackingNumber() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `THG-EG-${digits}`;
}

// =========================================================================
// API Routes
// =========================================================================

// Health check probe
app.get(['/health', '/api/health'], (req, res) => {
  const ip = getClientIp(req);
  res.json({
    status: 'ok',
    service: 'thg-pharma-backend',
    port: PORT,
    databaseConnected: isDbConnected(),
    clientIp: ip,
    timestamp: new Date().toISOString(),
  });
});

// Create Order endpoint with deep security telemetry & ERP-first tracking allocation
app.post('/api/orders', orderCreationLimiter, async (req, res) => {
  try {
    const {
      customerName,
      phone,
      whatsappPhone,
      governorate,
      address,
      notes = '',
      paymentMethod = 'cod',
      items = [],
      subtotal = 0,
      discount = 0,
      shipping = 0,
      total = 0,
    } = req.body;

    const rawCallPhone     = String(phone || '').trim();
    const rawWhatsappPhone = String(whatsappPhone || req.body.whatsapp_phone || '').trim();

    // 1. Basic validation (requires recipient name, address, and BOTH phone numbers)
    if (!customerName || !rawCallPhone || !rawWhatsappPhone || !address) {
      return res.status(400).json({
        error: 'Missing required delivery fields. Name, call phone, WhatsApp phone, and address are all required.',
        code: 'MISSING_FIELDS',
      });
    }

    const normPhone    = normalizePhone(rawCallPhone);
    const normWhatsapp = normalizePhone(rawWhatsappPhone);

    if (!normPhone || !normWhatsapp) {
      return res.status(400).json({
        error: 'Both phone numbers must be valid 11-digit Egyptian mobile numbers (010, 011, 012, 015).',
        code: 'INVALID_PHONE_FORMAT',
      });
    }

    // 2. Extract client security & device telemetry
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';
    const clientLanguage = req.headers['accept-language'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || '';
    const device = parseClientDevice(userAgent);

    // 3. Evaluate fraud / cyber risk score
    const riskAssessment = evaluateOrderRisk({
      ip,
      phone: normPhone,
      userAgent,
      items,
      customerName,
      total,
    });

    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const deliveryDateISO = deliveryDate.toISOString().split('T')[0];
    const estimatedDelivery = deliveryDate.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // 4. ERP-First Order Creation Strategy
    // Attempt to register the Sales Order in ERPNext immediately so the customer and
    // internal tools receive the real ERP sales order tracking ID right away.
    let erpOrderId = null;
    let erpSynced = false;
    let erpError = null;

    if (isConfigured()) {
      try {
        console.log(`[Order Flow] Attempting immediate ERP Sales Order creation for ${customerName} (${normPhone})...`);

        // a. Upsert Customer in ERP with BOTH call phone and WhatsApp phone
        const custRes = await upsertCustomer(customerName.trim(), normPhone, normWhatsapp);
        if (!custRes.ok) throw new Error(`Customer sync: ${custRes.error}`);

        // b. Upsert Address in ERP
        const addrRes = await upsertAddress(custRes.customer_id, address.trim(), governorate || 'Cairo');
        if (!addrRes.ok) throw new Error(`Address sync: ${addrRes.error}`);

        // c. Create Sales Order in ERP (includes company: 'Zabbtnalk', warehouse: 'Main Store - ZBT', both contact phones)
        const erpItems = items.map((i) => ({
          productId: i.productId || i.id,
          name: i.name,
          qty: i.qty || i.quantity || 1,
          price: i.price,
        }));

        const erpRes = await createErpOrder({
          customerId:    custRes.customer_id,
          addressId:     addrRes.address_id,
          contactId:     custRes.contact_id || null,
          callPhone:     normPhone,
          whatsappPhone: normWhatsapp,
          notes:         notes.trim(),
          items:         erpItems,
          deliveryDate:  deliveryDateISO,
        });

        if (!erpRes.ok) throw new Error(`Sales Order: ${erpRes.error}`);

        erpOrderId = erpRes.erp_order_id;
        erpSynced = true;
        console.log(`[Order Flow] SUCCESS: Immediate ERP Sales Order created -> ${erpOrderId}`);
      } catch (err) {
        erpError = err.message || String(err);
        console.warn(`[Order Flow] ERP first attempt failed (${erpError}). Falling back to local tracking queue...`);
      }
    }

    // Allocate tracking number:
    // If successfully created in ERP, the ERP Sales Order number IS the tracking code.
    // If ERP is unreachable or failed, generate a local fallback tracking number (THG-EG-XXXXXX).
    const trackingNumber = erpSynced && erpOrderId ? erpOrderId : generateTrackingNumber();

    const pool = getDb();

    if (pool && isDbConnected()) {
      // MySQL insertion with full security telemetry & both phone numbers
      const [orderResult] = await pool.query(
        `INSERT INTO orders 
        (tracking_number, customer_name, phone, whatsapp_phone, governorate, address, notes, payment_method, 
         subtotal, discount, shipping, total, status, estimated_delivery,
         erp_order_id, erp_synced_at, erp_sync_error,
         ip_address, user_agent, device_type, device_model, os_name, os_version,
         browser_name, browser_version, client_language, referrer, risk_score, is_suspicious, risk_flags, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          trackingNumber,
          customerName.trim(),
          normPhone,
          normWhatsapp,
          governorate || 'القاهرة',
          address.trim(),
          notes.trim(),
          paymentMethod,
          subtotal,
          discount,
          shipping,
          total,
          'confirmed',
          estimatedDelivery,
          erpOrderId,
          erpSynced ? new Date() : null,
          erpError,
          ip,
          userAgent,
          device.deviceType,
          device.deviceModel,
          device.osName,
          device.osVersion,
          device.browserName,
          device.browserVersion,
          clientLanguage,
          referrer,
          riskAssessment.riskScore,
          riskAssessment.isSuspicious ? 1 : 0,
          JSON.stringify(riskAssessment.flags),
        ]
      );

      const orderId = orderResult.insertId;

      // Insert line items
      for (const item of items) {
        const qty = Number(item.qty || item.quantity || 1);
        const price = Number(item.price || 0);
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, line_total)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.productId || 'item',
            item.name || 'منتج ألماني',
            qty,
            price,
            price * qty,
          ]
        );
      }

      console.log(
        `[Order Verified] ${trackingNumber} | ${customerName} | Call: ${normPhone} | WhatsApp: ${normWhatsapp} | IP: ${ip} | Device: ${device.deviceModel} | Risk: ${riskAssessment.riskScore}`
      );

      // If ERP creation did not succeed immediately, enqueue for background retry worker
      if (!erpSynced) {
        enqueueOrder(orderId);
      }

      // Fire-and-forget: notify team via WhatsApp notification service (/order-notify)
      notifyOrderCreated({
        erp_order_id:     erpOrderId,
        tracking_number:  trackingNumber,
        customer_name:    customerName,
        customer_phone:   normPhone,
        whatsapp_phone:   normWhatsapp,
        shipping_address: `${address}, ${governorate || 'القاهرة'}`,
        delivery_date:    deliveryDateISO,
        items,
        grand_total:      total,
        currency:         'EGP',
        notes:            notes + (normWhatsapp !== normPhone ? ` [واتساب: ${normWhatsapp}]` : ''),
      });
    } else {
      // In-memory fallback with full telemetry
      const savedOrder = {
        trackingNumber,
        erpOrderId,
        customerName,
        phone: normPhone,
        whatsappPhone: normWhatsapp,
        governorate,
        address,
        notes,
        paymentMethod,
        subtotal,
        discount,
        shipping,
        total,
        status: 'confirmed',
        estimatedDelivery,
        items,
        ipAddress: ip,
        deviceType: device.deviceType,
        deviceModel: device.deviceModel,
        osName: device.osName,
        browserName: device.browserName,
        riskScore: riskAssessment.riskScore,
        isSuspicious: riskAssessment.isSuspicious,
        createdAt: now.toISOString(),
      };
      memoryOrders.unshift(savedOrder);
      console.log(
        `[Order in Memory Fallback] ${trackingNumber} | Call: ${normPhone} | WhatsApp: ${normWhatsapp} | Risk: ${riskAssessment.riskScore}`
      );

      // Fire-and-forget notification even in memory fallback
      notifyOrderCreated({
        erp_order_id:     erpOrderId,
        tracking_number:  trackingNumber,
        customer_name:    customerName,
        customer_phone:   normPhone,
        whatsapp_phone:   normWhatsapp,
        shipping_address: `${address}, ${governorate || 'القاهرة'}`,
        delivery_date:    deliveryDateISO,
        items,
        grand_total:      total,
        currency:         'EGP',
        notes:            notes + (normWhatsapp !== normPhone ? ` [واتساب: ${normWhatsapp}]` : ''),
      });
    }

    res.status(201).json({
      success: true,
      trackingNumber,
      erpOrderId: erpOrderId || null,
      erpSynced,
      status: 'confirmed',
      estimatedDelivery,
      items: items.map((i) => ({
        name: i.name,
        qty: i.qty || i.quantity || 1,
        price: i.price,
      })),
      subtotal,
      discount,
      shipping,
      total,
      phone: normPhone,
      whatsappPhone: normWhatsapp,
      message: erpSynced ? 'Order created directly in ERP' : 'Order placed and queued for ERP sync',
    });
  } catch (error) {
    console.error('[Error Creating Order]:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// =========================================================================
// Order Status Natural Language Labels (for AI Agent / WhatsApp MCP & UI)
// =========================================================================
const ORDER_STATUS_LABELS = {
  confirmed: {
    ar: 'تم تأكيد الطلب وجاري تجهيزه بالمستودع المبرد',
    en: 'Order confirmed & preparing in cold-chain warehouse',
  },
  quality_check: {
    ar: 'فحص الجودة والمطابقة الصيدلانية',
    en: 'Pharma quality & compliance inspection',
  },
  in_transit: {
    ar: 'في الطريق مع مندوب الشحن السريع',
    en: 'In transit with express courier',
  },
  out_for_delivery: {
    ar: 'خرج للتسليم مع المندوب اليوم',
    en: 'Out for delivery with courier today',
  },
  delivered: {
    ar: 'تم التسليم بنجاح والمعاينة قبل الدفع',
    en: 'Delivered successfully with COD pack inspection',
  },
  cancelled: {
    ar: 'تم إلغاء الطلب',
    en: 'Order cancelled',
  },
};

// =========================================================================
// Dual Protocol Order Tracking Handler (POST /api/orders/track & GET /api/orders/track)
//
// Dual protocol support:
//   - POST body: { trackingNumber, phone }
//   - GET query: ?trackingNumber=...&phone=...
//   - GET param: /api/orders/:trackingNumber?phone=...
//
// Security & Architecture:
//   1. Tracking code flexibility: matches either internal THG-EG-XXXXXX
//      OR ERP Sales Order code (e.g. SAL-ORD-2026-00001), case-insensitively.
//   2. Identity verification: phone must match the record's normalized Egyptian phone.
//   3. Live ERP Refresh: if synced to ERP and order is not terminal, checks ERP
//      live to ensure status is up to date immediately without waiting for cron.
//   4. MCP-ready output: outputs rich status labels (ar/en) ready for WhatsApp AI agent.
//   5. Attack mitigation: rate-limited, ownership mismatch returns 404 to avoid oracle.
// =========================================================================
async function handleOrderTrack(req, res) {
  try {
    const rawTracking = String(
      req.body?.trackingNumber ||
      req.query?.trackingNumber ||
      req.params?.trackingNumber ||
      ''
    ).trim();

    const rawPhone = String(
      req.body?.phone ||
      req.query?.phone ||
      ''
    ).trim();

    if (!rawTracking || !rawPhone) {
      return res.status(400).json({
        success: false,
        error: 'Both trackingNumber and phone are required for order tracking verification.',
        code: 'MISSING_FIELDS',
      });
    }

    const phone = normalizePhone(rawPhone);
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Egyptian phone number format. Must be an 11-digit mobile number (e.g. 01XXXXXXXXX).',
        code: 'INVALID_PHONE',
      });
    }

    const pool = getDb();

    if (pool && isDbConnected()) {
      // 1. Match against either internal tracking number OR ERP external Sales Order ID (case-insensitive)
      const [rows] = await pool.query(
        `SELECT id, tracking_number, erp_order_id, customer_name, phone, whatsapp_phone,
                governorate, payment_method, subtotal, discount, shipping,
                total, status, estimated_delivery, created_at, erp_synced_at
         FROM orders
         WHERE (UPPER(tracking_number) = UPPER(?) OR UPPER(COALESCE(erp_order_id, '')) = UPPER(?))
         LIMIT 1`,
        [rawTracking, rawTracking]
      );

      if (rows.length === 0) {
        const ip = getClientIp(req);
        try {
          await pool.query(
            `INSERT INTO security_audit_logs
              (event_type, ip_address, endpoint, user_agent, payload_summary, action_taken)
             VALUES ('ORDER_NOT_FOUND', ?, '/api/orders/track', ?, ?, 'logged')`,
            [ip, req.headers['user-agent'] || '', `tracking=${rawTracking}`]
          );
        } catch (_) {}
        return res.status(404).json({ success: false, error: 'Order not found.', code: 'NOT_FOUND' });
      }

      const order = rows[0];

      // 2. Strict phone ownership verification (accepts either the call phone OR WhatsApp phone)
      const storedCallPhone     = normalizePhone(order.phone);
      const storedWhatsappPhone = normalizePhone(order.whatsapp_phone || '');
      const isOwner = (phone === storedCallPhone || (storedWhatsappPhone && phone === storedWhatsappPhone));

      if (!isOwner) {
        const ip = getClientIp(req);
        console.warn(`[Security] Tracking ownership mismatch: ${rawTracking} queried with phone ${phone} | Call: ${storedCallPhone}, WA: ${storedWhatsappPhone} | IP: ${ip}`);
        try {
          await pool.query(
            `INSERT INTO security_audit_logs
              (event_type, ip_address, endpoint, user_agent, payload_summary, action_taken)
             VALUES ('TRACKING_OWNERSHIP_VIOLATION', ?, '/api/orders/track', ?, ?, 'blocked')`,
            [ip, req.headers['user-agent'] || '', `tracking=${rawTracking} phone_mismatch`]
          );
        } catch (_) {}
        // Return 404 to avoid enumeration / phone probing
        return res.status(404).json({ success: false, error: 'Order not found.', code: 'NOT_FOUND' });
      }

      // 3. Live ERP Refresh (if linked and not delivered/cancelled)
      if (order.erp_order_id && !['delivered', 'cancelled'].includes(order.status) && isConfigured()) {
        try {
          const liveErp = await getErpOrderStatus(order.erp_order_id);
          if (liveErp.ok && liveErp.local_status && liveErp.local_status !== order.status) {
            order.status = liveErp.local_status;
            pool.query(
              `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
              [liveErp.local_status, order.id]
            ).catch(() => {});
          }
        } catch (erpErr) {
          // Non-fatal: fall back to cached database status
        }
      }

      // 4. Fetch line items
      const [items] = await pool.query(
        `SELECT product_id AS productId, product_name AS name,
                quantity AS qty, unit_price AS price, line_total AS lineTotal
         FROM order_items WHERE order_id = ?`,
        [order.id]
      );

      const statusLabels = ORDER_STATUS_LABELS[order.status] || {
        ar: order.status,
        en: order.status,
      };

      // 5. Safe, rich response for Frontend & WhatsApp AI Agent MCP
      return res.json({
        success:          true,
        trackingNumber:   order.tracking_number,
        erpOrderId:       order.erp_order_id || null,
        status:           order.status,
        statusLabel_ar:   statusLabels.ar,
        statusLabel_en:   statusLabels.en,
        customerName:     order.customer_name,
        phone:            order.phone,
        whatsappPhone:    order.whatsapp_phone || order.phone,
        governorate:      order.governorate,
        paymentMethod:    order.payment_method,
        subtotal:         order.subtotal,
        discount:         order.discount,
        shipping:         order.shipping,
        total:            order.total,
        currency:         'EGP',
        estimatedDelivery: order.estimated_delivery,
        createdAt:        order.created_at,
        erpSynced:        !!order.erp_synced_at,
        items,
      });
    }

    // In-memory fallback (if DB is temporarily disconnected)
    const match = memoryOrders.find(
      (o) =>
        (o.trackingNumber.toUpperCase() === rawTracking.toUpperCase() ||
         (o.erpOrderId && o.erpOrderId.toUpperCase() === rawTracking.toUpperCase())) &&
        (normalizePhone(o.phone) === phone || normalizePhone(o.whatsappPhone || '') === phone)
    );

    if (match) {
      const statusLabels = ORDER_STATUS_LABELS[match.status] || {
        ar: match.status,
        en: match.status,
      };
      return res.json({
        success: true,
        ...match,
        statusLabel_ar: statusLabels.ar,
        statusLabel_en: statusLabels.en,
        currency: 'EGP',
      });
    }

    return res.status(404).json({ success: false, error: 'Order not found.', code: 'NOT_FOUND' });
  } catch (error) {
    console.error('[Error Tracking Order]:', error);
    res.status(500).json({ success: false, error: 'Tracking lookup failed.', code: 'SERVER_ERROR' });
  }
}

// Register tracking endpoints across both POST & GET methods
app.post('/api/orders/track', trackingLimiter, handleOrderTrack);
app.get('/api/orders/track', trackingLimiter, handleOrderTrack);
app.get('/api/orders/:trackingNumber', trackingLimiter, handleOrderTrack);

// Restock Interest endpoint with telemetry
app.post('/api/restock-interest', restockLimiter, async (req, res) => {
  try {
    const { productId, productName = '', contact } = req.body;

    if (!productId || !contact) {
      return res.status(400).json({ error: 'Missing productId or contact' });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';

    const pool = getDb();
    if (pool && isDbConnected()) {
      await pool.query(
        `INSERT INTO restock_interests (product_id, product_name, contact, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)`,
        [productId, productName, contact, ip, userAgent]
      );
    } else {
      memoryRestock.push({ productId, productName, contact, ip, userAgent, createdAt: new Date() });
    }

    console.log(`[Restock Registered] product: ${productId} -> ${contact} (IP: ${ip})`);
    res.json({ success: true, message: 'Restock interest registered' });
  } catch (error) {
    console.error('[Error in Restock Interest]:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Initialize database connection and start listening on port 8877
async function startServer() {
  await initDb();

  // Start ERP background sync after DB is ready
  startErpSync();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`  THG 4 Pharma Backend Server running on port ${PORT}`);
    console.log(`  Cyber Protection: Active (IP Telemetry & Rate Limiting)`);
    console.log(`  API Endpoint:     http://localhost:${PORT}/api/orders`);
    console.log(`  Health Probe:     http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

startServer();
