import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thg_pharma',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isConnected = false;

export async function initDb() {
  try {
    // 1. Ensure database exists
    const adminConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });

    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConn.end();

    // 2. Connect pool to the database
    pool = mysql.createPool(config);

    // 3. Create orders table with comprehensive cyber-safety & telemetry fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tracking_number VARCHAR(32) NOT NULL UNIQUE,
        customer_name VARCHAR(160) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        governorate VARCHAR(80) NOT NULL,
        address TEXT NOT NULL,
        notes TEXT NULL,
        payment_method VARCHAR(40) NOT NULL DEFAULT 'cod',
        currency VARCHAR(3) NOT NULL DEFAULT 'EGP',
        subtotal INT NOT NULL,
        discount INT NOT NULL DEFAULT 0,
        shipping INT NOT NULL DEFAULT 0,
        total INT NOT NULL,
        status ENUM('confirmed', 'quality_check', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'confirmed',
        estimated_delivery VARCHAR(120) NULL,
        
        -- Cyber & Fraud Safety Telemetry
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        device_type VARCHAR(40) NULL,
        device_model VARCHAR(120) NULL,
        os_name VARCHAR(60) NULL,
        os_version VARCHAR(30) NULL,
        browser_name VARCHAR(60) NULL,
        browser_version VARCHAR(30) NULL,
        client_language VARCHAR(60) NULL,
        referrer TEXT NULL,
        risk_score INT NOT NULL DEFAULT 0,
        is_suspicious TINYINT(1) NOT NULL DEFAULT 0,
        risk_flags TEXT NULL,

        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tracking (tracking_number),
        INDEX idx_phone (phone),
        INDEX idx_ip (ip_address),
        INDEX idx_suspicious (is_suspicious),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Helper: Safely add security columns if table was created previously without them
    const securityColumns = [
      { name: 'ip_address', type: 'VARCHAR(45) NULL' },
      { name: 'user_agent', type: 'TEXT NULL' },
      { name: 'device_type', type: 'VARCHAR(40) NULL' },
      { name: 'device_model', type: 'VARCHAR(120) NULL' },
      { name: 'os_name', type: 'VARCHAR(60) NULL' },
      { name: 'os_version', type: 'VARCHAR(30) NULL' },
      { name: 'browser_name', type: 'VARCHAR(60) NULL' },
      { name: 'browser_version', type: 'VARCHAR(30) NULL' },
      { name: 'client_language', type: 'VARCHAR(60) NULL' },
      { name: 'referrer', type: 'TEXT NULL' },
      { name: 'risk_score', type: 'INT NOT NULL DEFAULT 0' },
      { name: 'is_suspicious', type: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'risk_flags', type: 'TEXT NULL' },
    ];

    for (const col of securityColumns) {
      try {
        await pool.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.type};`);
      } catch (e) {
        // Column already exists or table is up to date, ignore
      }
    }

    // 4. Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id VARCHAR(64) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price INT NOT NULL,
        line_total INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Create restock_interests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restock_interests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(64) NOT NULL,
        product_name VARCHAR(255) NULL,
        contact VARCHAR(64) NOT NULL,
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        notified TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_product_restock (product_id),
        INDEX idx_contact (contact)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Create security_audit_logs table (tracks attacks, rate limits, phishing attempts)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS security_audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(60) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        endpoint VARCHAR(120) NOT NULL,
        user_agent TEXT NULL,
        payload_summary TEXT NULL,
        action_taken VARCHAR(40) NOT NULL DEFAULT 'blocked',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_event (event_type),
        INDEX idx_audit_ip (ip_address),
        INDEX idx_audit_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Add ERP sync columns to orders (safe — ignored if already present)
    const erpColumns = [
      { name: 'erp_order_id',  type: 'VARCHAR(64) NULL' },
      { name: 'erp_synced_at', type: 'DATETIME NULL' },
      { name: 'erp_sync_error', type: 'TEXT NULL' },
    ];
    for (const col of erpColumns) {
      try {
        await pool.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.type};`);
        await pool.query(`ALTER TABLE orders ADD INDEX idx_erp_order_id (erp_order_id);`).catch(() => {});
      } catch (e) {
        // Column already exists — fine
      }
    }

    // 8. Create erp_sync_queue table
    // Tracks the async push of each web order into ERPNext with retry logic.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS erp_sync_queue (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL UNIQUE,
        erp_order_id VARCHAR(64) NULL,
        status ENUM('pending','processing','retrying','synced','failed') NOT NULL DEFAULT 'pending',
        attempts INT NOT NULL DEFAULT 0,
        last_error TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_attempt_at DATETIME NULL,
        next_attempt_at DATETIME NULL,
        synced_at DATETIME NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_queue_status (status),
        INDEX idx_queue_next (next_attempt_at),
        INDEX idx_queue_order (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    isConnected = true;
    console.log(`[Database] Connected successfully to MySQL database "${config.database}" on ${config.host}:${config.port}`);
    return pool;
  } catch (error) {
    console.warn(`[Database] Warning: Could not connect to MySQL (${error.message}).`);
    console.warn(`[Database] Verify MySQL is running on port ${config.port} and credentials in backend/.env match.`);
    isConnected = false;
    return null;
  }
}

export function getDb() {
  return pool;
}

export function isDbConnected() {
  return isConnected;
}
