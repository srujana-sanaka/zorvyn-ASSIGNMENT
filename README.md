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
docs/
  API.md
  DEPLOY_RENDER.md

```

## Setup (local)

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Create a `.env` file in the project root. Copy the sample file in the repo (e.g. `.env.example` or `.ENV.EXAMPLE` — same idea, different casing) and fill in real values. Never commit `.env`.

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

**Detailed API doc:** [docs/API.md](docs/API.md)

## Assumptions

- **First admin:** There is no public “register as admin” endpoint. Self-registration creates a **viewer**. The first admin is created by promoting a user in SQL (`UPDATE users SET role = 'admin' WHERE email = '...'`) or by seeding a user in the database. That keeps the assignment small and avoids open admin signup.
- **JWT:** Tokens encode a subject (`sub` = user id). Role and status are loaded from the database on each authenticated request, so role changes apply without issuing a new token (until you want to force re-login for other reasons).
- **Transactions:** `user_id` is the owning user (audit / attribution). Admins can optionally set `user_id` when creating a row; otherwise it defaults to the admin’s id.
- **Dashboard:** Aggregates are global (all transactions in the table), not scoped per user, unless you extend the queries later.

## Tradeoffs and design choices

- **Layering:** Routes stay thin; controllers orchestrate; services hold business rules; models run SQL. That’s a bit more files than a single `server.js`, but it scales better and matches how teams structure Express apps.
- **bcryptjs vs bcrypt:** `bcryptjs` is pure JavaScript (easy install on Windows). Slightly slower than native `bcrypt`; fine for an assignment and small traffic.
- **Dashboard SQL:** Summary uses a few focused queries instead of one huge SQL statement — easier to read and tune; one more round-trip to the database than a single mega-query.
- **Production SSL for Postgres:** When `DATABASE_URL` is used and `NODE_ENV=production`, the pool enables SSL with `rejectUnauthorized: false` so managed Postgres (Render, etc.) works without extra CA setup. Stricter setups would pin a CA certificate.
- **Validation:** `express-validator` keeps validation next to routes; alternative is a schema library (e.g. Zod) for shared types between layers.

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


## Deploy on Render

See **[docs/DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md)** for PostgreSQL + Web Service, env vars, running `sql/schema.sql`, and what to paste in the assignment “Live Demo or API URL” field (`https://<your-app>.onrender.com`).



