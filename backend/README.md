# THG 4 Pharma — Backend API Server (Port 8877)

A dedicated Node.js Express.js backend for managing orders, order tracking, and restock waitlists in MySQL for the **THG 4 Pharma (True Health Goals)** store.

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
Just start the server! On startup, `src/server.js` automatically creates the `thg_pharma` database and all required tables (`orders`, `order_items`, `restock_interests`) if they do not exist:
```bash
npm start
```

### Option B: Manual SQL Script
Run the provided `schema.sql` directly in MySQL CLI or MySQL Workbench:
```bash
mysql -u root -p < schema.sql
```

### Option C: Prisma
If you prefer Prisma:
```bash
npx prisma db push
```
To visually view and edit orders in your browser:
```bash
npx prisma studio
```

---

## 🔌 API Endpoints Summary

- **`POST /api/orders`** — Creates a new order and line items in MySQL.
- **`GET /api/orders/:trackingNumber`** — Retrieves order details and delivery status by tracking code or phone number.
- **`POST /api/restock-interest`** — Registers customer contact for out-of-stock items.
- **`GET /api/health`** — Liveness and database connection probe.

---

## 🛠️ Running the Server
```bash
npm start
# or with auto-reload during development:
npm run dev
```
Server listens on **`http://localhost:8877`**.
