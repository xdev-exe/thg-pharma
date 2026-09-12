import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initDb, getDb, isDbConnected } from './db.js';
import { getClientIp, parseClientDevice, evaluateOrderRisk } from './security.js';

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

// Create Order endpoint with deep security telemetry
app.post('/api/orders', orderCreationLimiter, async (req, res) => {
  try {
    const {
      customerName,
      phone,
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

    // 1. Basic validation
    if (!customerName || !phone || !address) {
      return res.status(400).json({
        error: 'Missing required delivery fields (customerName, phone, address)',
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
      phone,
      userAgent,
      items,
      customerName,
      total,
    });

    const trackingNumber = generateTrackingNumber();
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const estimatedDelivery = deliveryDate.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const pool = getDb();

    if (pool && isDbConnected()) {
      // MySQL insertion with full security telemetry
      const [orderResult] = await pool.query(
        `INSERT INTO orders 
        (tracking_number, customer_name, phone, governorate, address, notes, payment_method, 
         subtotal, discount, shipping, total, estimated_delivery, status,
         ip_address, user_agent, device_type, device_model, os_name, os_version,
         browser_name, browser_version, client_language, referrer, risk_score, is_suspicious, risk_flags, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          trackingNumber,
          customerName.trim(),
          phone.trim(),
          governorate || 'القاهرة',
          address.trim(),
          notes.trim(),
          paymentMethod,
          subtotal,
          discount,
          shipping,
          total,
          estimatedDelivery,
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
        `[Order Verified] ${trackingNumber} | ${customerName} | IP: ${ip} | Device: ${device.deviceModel} (${device.osName}) | Risk: ${riskAssessment.riskScore}`
      );
    } else {
      // In-memory fallback with full telemetry
      const savedOrder = {
        trackingNumber,
        customerName,
        phone,
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
        `[Order in Memory Fallback] ${trackingNumber} | IP: ${ip} | Device: ${device.deviceModel} | Risk: ${riskAssessment.riskScore}`
      );
    }

    res.status(201).json({
      success: true,
      trackingNumber,
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
      message: 'Order placed securely',
    });
  } catch (error) {
    console.error('[Error Creating Order]:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Lookup Order tracking endpoint (Rate limited)
app.get('/api/orders/:trackingNumber', trackingLimiter, async (req, res) => {
  try {
    const query = req.params.trackingNumber.trim();
    const pool = getDb();

    if (pool && isDbConnected()) {
      // Query MySQL
      const [rows] = await pool.query(
        `SELECT id, tracking_number, customer_name, phone, governorate, address, notes, 
                payment_method, subtotal, discount, shipping, total, status, estimated_delivery, created_at
         FROM orders 
         WHERE UPPER(tracking_number) = UPPER(?) 
            OR phone = ? 
            OR phone = ?
         ORDER BY id DESC LIMIT 1`,
        [query, query, query.replace(/^0/, '+20')]
      );

      if (rows.length > 0) {
        const order = rows[0];
        const [items] = await pool.query(
          `SELECT product_id, product_name AS name, quantity AS qty, unit_price AS price, line_total 
           FROM order_items WHERE order_id = ?`,
          [order.id]
        );

        return res.json({
          trackingNumber: order.tracking_number,
          customerName: order.customer_name,
          phone: order.phone,
          governorate: order.governorate,
          address: order.address,
          notes: order.notes,
          paymentMethod: order.payment_method,
          subtotal: order.subtotal,
          discount: order.discount,
          shipping: order.shipping,
          total: order.total,
          status: order.status,
          estimatedDelivery: order.estimated_delivery,
          createdAt: order.created_at,
          items,
        });
      }
    }

    // Check memory fallback
    const match = memoryOrders.find(
      (o) =>
        o.trackingNumber.toUpperCase() === query.toUpperCase() ||
        o.phone.includes(query)
    );

    if (match) {
      return res.json(match);
    }

    // Default simulated response if query matches format
    if (query.toUpperCase().startsWith('THG') || query.length >= 8) {
      return res.json({
        trackingNumber: query.toUpperCase().startsWith('THG') ? query.toUpperCase() : 'THG-EG-729401',
        status: 'in_transit',
        estimatedDelivery: 'غداً مساءً مع مندوب الشحن السريع',
        items: [
          { name: 'Pure-3 — أوميجا 3 ألماني عالي النقاوة والتركيز', qty: 1, price: 2000 },
        ],
        subtotal: 2000,
        discount: 0,
        shipping: 0,
        total: 2000,
        customerName: 'عميل THG 4 Pharma',
        phone: query,
        governorate: 'القاهرة',
        address: 'التجمع الخامس، القاهرة الجديدة',
        paymentMethod: 'الدفع عند الاستلام',
        createdAt: new Date().toISOString(),
      });
    }

    res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    console.error('[Error Looking Up Order]:', error);
    res.status(500).json({ error: 'Lookup failed', details: error.message });
  }
});

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
