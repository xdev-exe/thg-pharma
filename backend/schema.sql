-- =========================================================
-- THG 4 Pharma (True Health Goals) - MySQL Database Schema
-- Includes Enterprise Cyber Protection & Anti-Fraud Telemetry
-- =========================================================

CREATE DATABASE IF NOT EXISTS thg_pharma
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE thg_pharma;

-- Orders Table
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
  
  -- Cyber Safety, Anti-Phishing & Fraud Telemetry
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

-- Order Items Table
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

-- Restock Priority Waitlist Table
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

-- Security Audit Logs Table (Rate Limits, Blocked Attacks, Bot Probes)
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
