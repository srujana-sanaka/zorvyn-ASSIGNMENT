# Finance Data Processing and Access Control System (Backend)

Express + PostgreSQL backend with JWT auth, role-based access control, financial transactions, and dashboard analytics.

## Tech stack
- Node.js + Express
- PostgreSQL
- JWT auth (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Validation (`express-validator`)

## Project structure
```
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
  app.js
  server.js
sql/
  schema.sql
```

## Setup (local)

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Create a `.env` file in the project root (copy from `.env.example`).

### 3) Create database + schema
Create a database (example: `finance_db`) and run:

```bash
psql "postgresql://postgres:postgres@localhost:5432/finance_db" -f sql/schema.sql
```

### 4) Start the API
```bash
npm run dev
```

Health check:
- `GET /health`

## Roles & access control
- **viewer**: can read dashboard only
- **analyst**: can read dashboard + view transactions
- **admin**: full access (user management + transaction CRUD)

Notes:
- `/api/auth/register` creates an **active viewer** by default (simple internship-friendly flow).
- Admin can create users with roles and status via `/api/users`.

## API documentation (endpoints)

### Auth
- **POST** `/api/auth/register`
  - Body: `{ "email": "...", "password": "..." }`
  - Returns: `{ user, token }`
- **POST** `/api/auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Returns: `{ user, token }`

### Users (admin only)
- **POST** `/api/users`
  - Body: `{ "email": "...", "password": "...", "role": "admin|analyst|viewer", "status": "active|inactive" }`
- **GET** `/api/users?limit=50&offset=0`
- **PATCH** `/api/users/:id`
  - Body: `{ "role": "...", "status": "..." }`

### Transactions
- **GET** `/api/transactions`
  - Roles: `admin`, `analyst`
  - Filters (query): `type=income|expense`, `category=...`, `startDate=YYYY-MM-DD`, `endDate=YYYY-MM-DD`
  - Pagination: `limit`, `offset`
- **POST** `/api/transactions`
  - Role: `admin`
  - Body: `{ "amount": 1200.50, "type": "income", "category": "salary", "date": "2026-04-01", "notes": "optional", "user_id": "optional UUID" }`
- **PATCH** `/api/transactions/:id`
  - Role: `admin`
- **DELETE** `/api/transactions/:id`
  - Role: `admin`

### Dashboard
- **GET** `/api/dashboard/summary`
  - Roles: `admin`, `analyst`, `viewer`
  - Query: `recentLimit=10`


