# THG 4 Pharma — Backend API Server (Port 8877)

A robust Node.js Express.js backend for managing orders, order tracking, restock waitlists, and **enterprise cyber protection & anti-fraud telemetry** in MySQL for the **THG 4 Pharma (True Health Goals)** store.

---

## 🛡️ Cyber Protection & Anti-Fraud Features

1. **Client IP & Proxy Resolution:** Accurately extracts client IP across Cloudflare (`cf-connecting-ip`), Nginx (`x-real-ip`), and load-balancer proxies (`x-forwarded-for`).
2. **Device & Platform Telemetry:** Uses `ua-parser-js` to capture:
   - Device Type (`mobile`, `tablet`, `desktop`)
   - Device Model (e.g. `Apple iPhone`, `Samsung Galaxy`, `Windows PC`)
   - Operating System & Version (`iOS`, `Android`, `Windows`)
   - Browser & Version (`Safari`, `Chrome Mobile`, etc.)
   - Client Language & Referrer
3. **Automated Risk & Fraud Scoring (0–100):**
   - Flags automated script / headless bot signatures (`curl`, `python`, `postman`, `puppeteer`, etc.)
   - Validates Egyptian mobile formats (`010`, `011`, `012`, `015`)
   - Detects inventory exhaustion probes (abnormal bulk quantities)
   - Flags invalid or zero totals
   - Stores `risk_score`, `is_suspicious` flag, and granular `risk_flags` with every order.
4. **Multi-Tier Rate Limiting (`express-rate-limit`):**
   - **Global API:** Max 150 requests / 15 mins per IP.
   - **Order Creation:** Max 8 orders / 15 mins per IP (prevents spam floods & automated fake orders).
   - **Order Tracking:** Max 40 lookups / 15 mins per IP (prevents order enumeration attacks).
   - **Restock Alert:** Max 12 requests / 15 mins per IP.
5. **Payload Size Guard:** Limits incoming JSON body to `64kb` to prevent memory buffer exhaustion attacks.
6. **Security Audit Log:** Dedicated `security_audit_logs` table logs rate-limit violations and suspicious events.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
Make sure `backend/.env` has your MySQL credentials:
```env
PORT=8877
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=thg_pharma
DATABASE_URL="mysql://root:your_password@localhost:3306/thg_pharma"
```

---

## 🗄️ Database Initialization (Choose Option A or B)

### Option A: Automatic (Built-in)
Just start the server! On startup, `src/server.js` automatically creates the `thg_pharma` database and all required tables with security columns:
```bash
npm start
```

### Option B: Manual SQL Script
Run the provided `schema.sql` directly in MySQL CLI or MySQL Workbench:
```bash
mysql -u root -p < schema.sql
```

### Option C: Prisma
```bash
cd backend
npx prisma db push

# (Optional) Open browser GUI to view and inspect orders & security telemetry
npx prisma studio
```

---

## 🔌 API Endpoints Summary

- **`POST /api/orders`** — Secure order creation with rate limit & device fingerprinting.
- **`GET /api/orders/:trackingNumber`** — Rate-limited order lookup and timeline status.
- **`POST /api/restock-interest`** — Waitlist alert registration with client IP log.
- **`GET /api/health`** — Liveness probe with client IP resolution.

---

## 🛠️ Running the Server
```bash
npm start
# or with live reload during development:
npm run dev
```
Server listens on **`http://localhost:8877`**.
