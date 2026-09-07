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

    // 3. Create tables if not exist
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
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tracking (tracking_number),
        INDEX idx_phone (phone),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS restock_interests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(64) NOT NULL,
        product_name VARCHAR(255) NULL,
        contact VARCHAR(64) NOT NULL,
        notified TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_product_restock (product_id),
        INDEX idx_contact (contact)
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
