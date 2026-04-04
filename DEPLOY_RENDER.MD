# Deploy this API on Render

Step-by-step for a **Web Service** + **PostgreSQL** on [Render](https://render.com).

## 1. Push code to GitHub

Render deploys from a repo. Your **root** that contains `package.json` should be what gets deployed (this project: folder with `src/`, `sql/`, `package.json`).

If the assignment repo is only this backend, connect that repo as-is. If the repo has a parent folder, either:

- set **Root Directory** in Render to the backend folder (e.g. `zorvyn-ASSIGNMENT`), or  
- make a repo whose root *is* the backend.

## 2. Create PostgreSQL on Render

1. Render Dashboard → **New +** → **PostgreSQL**.
2. Pick a name, region, plan → **Create Database**.
3. After it provisions, open the DB → copy **Internal Database URL** (or **External** if you run migrations from your laptop).

You will use this as **`DATABASE_URL`** on the web service.

## 3. Run the schema on Render Postgres

Tables must exist before the app can register users.

**Option A — from your PC**  
Use the **External Database URL** in `psql` or pgAdmin:

```bash
psql "YOUR_EXTERNAL_DATABASE_URL" -f sql/schema.sql
```

**Option B — Render Shell**  
If your plan includes shell access to the Postgres instance, paste the contents of `sql/schema.sql` into the SQL console and execute.

## 4. Create the Web Service

1. **New +** → **Web Service** → connect the same GitHub repo.
2. Settings that usually work for this project:

| Setting | Value |
|--------|--------|
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/health` |

3. **Root Directory** — set if your backend lives in a subfolder (e.g. `zorvyn-ASSIGNMENT`).

## 5. Environment variables

In the Web Service → **Environment**:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Paste from Render Postgres (use **Internal** URL if web + DB are both on Render; same region is typical). |
| `JWT_SECRET` | Long random string (generate locally; don’t reuse your dev secret if this is public). |
| `JWT_EXPIRES_IN` | `1d` (or what you prefer) |
| `CORS_ORIGIN` | Your frontend URL, or `*` for quick testing only |

**Note:** Render sets **`PORT`** automatically — do not hardcode it; the app already uses `process.env.PORT`.

## 6. Link DB to the service (optional)

If you create Postgres first, you can **link** it to the Web Service in the Render UI so `DATABASE_URL` is injected without manual paste. Either way, the app only needs `DATABASE_URL` set.

## 7. Deploy and verify

1. **Manual Deploy** → deploy latest commit.
2. Open `https://<your-service>.onrender.com/health` — expect `{"ok":true,"env":"production"}`.
3. Test `POST /api/auth/register` against the same host.

## 8. URLs for your assignment form

- **GitHub Repository URL** — your public repo link.  
- **Live Demo or API Documentation URL** (optional field):  
  - **Live API:** `https://<your-service>.onrender.com` (graders can hit `/health` and read `docs/API.md` on GitHub), or  
  - **Docs:** link to `docs/API.md` on GitHub, e.g.  
    `https://github.com/<you>/<repo>/blob/main/docs/API.md`

Render free tier **spins down** after idle; first request after sleep can take ~30–60s.

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| Crash on boot, DB errors | `DATABASE_URL` wrong or schema not applied. |
| `password authentication failed` | Wrong URL or linked DB mismatch. |
| `relation "users" does not exist` | Run `sql/schema.sql` on the **same** database as `DATABASE_URL`. |
| CORS errors from a browser | Set `CORS_ORIGIN` to your frontend origin. |
