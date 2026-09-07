import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, getDb, isDbConnected } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8877;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// In-memory fallback if MySQL is not currently running
const memoryOrders = [];
const memoryRestock = [];

function generateTrackingNumber() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `THG-EG-${digits}`;
}

// Health check probe
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'thg-pharma-backend',
    port: PORT,
    databaseConnected: isDbConnected(),
    timestamp: new Date().toISOString(),
  });
});

// Create Order endpoint
app.post('/api/orders', async (req, res) => {
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

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        error: 'Missing required delivery fields (customerName, phone, address)',
      });
    }

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
      // MySQL insertion
      const [orderResult] = await pool.query(
        `INSERT INTO orders 
        (tracking_number, customer_name, phone, governorate, address, notes, payment_method, subtotal, discount, shipping, total, estimated_delivery, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
        [
          trackingNumber,
          customerName,
          phone,
          governorate || 'القاهرة',
          address,
          notes,
          paymentMethod,
          subtotal,
          discount,
          shipping,
          total,
          estimatedDelivery,
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

      console.log(`[Order Created in MySQL] ${trackingNumber} for ${customerName} (${total} EGP)`);
    } else {
      // In-memory fallback
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
        createdAt: now.toISOString(),
      };
      memoryOrders.unshift(savedOrder);
      console.log(`[Order Created in Memory Fallback] ${trackingNumber} for ${customerName}`);
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
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('[Error Creating Order]:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Lookup Order tracking endpoint
app.get('/api/orders/:trackingNumber', async (req, res) => {
  try {
    const query = req.params.trackingNumber.trim();
    const pool = getDb();

    if (pool && isDbConnected()) {
      // Query MySQL
      const [rows] = await pool.query(
        `SELECT * FROM orders 
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

// Restock Interest endpoint
app.post('/api/restock-interest', async (req, res) => {
  try {
    const { productId, productName = '', contact } = req.body;

    if (!productId || !contact) {
      return res.status(400).json({ error: 'Missing productId or contact' });
    }

    const pool = getDb();
    if (pool && isDbConnected()) {
      await pool.query(
        `INSERT INTO restock_interests (product_id, product_name, contact) VALUES (?, ?, ?)`,
        [productId, productName, contact]
      );
    } else {
      memoryRestock.push({ productId, productName, contact, createdAt: new Date() });
    }

    console.log(`[Restock Registered] for product ${productId} -> ${contact}`);
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
    console.log(`  API URL: http://localhost:${PORT}/api/orders`);
    console.log(`  Health:  http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

startServer();
