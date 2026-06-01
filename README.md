# Trackr — Job Application Manager

Portfolio-style **full-stack** demo: **React (Vite)** + **Node.js (Express)** + **PostgreSQL**, **REST API**, **JWT auth** (optional), **GitHub Actions CI**, and deploy recipes for **Vercel** (frontend) + **Render** (API).

## Architecture

| Layer | Tech |
|--------|------|
| UI | React 19, Vite 8, Tailwind v4, shadcn-style components, @dnd-kit, Recharts |
| API | Express.js, `pg` (node-postgres), CORS, JWT (`jsonwebtoken`) + bcrypt |
| CI | GitHub Actions — lint + frontend build + API syntax check on push/PR |
| Data | PostgreSQL — managed (**Neon**, **Supabase**, **Railway**, Render Postgres, etc.) or local Docker |

### REST API (`/api/applications`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/applications` | List all (newest `dateApplied` first) |
| `POST` | `/api/applications` | Create (`company`, `role`, `status`, `dateApplied`, `notes`) |
| `PATCH` | `/api/applications/:id` | Partial update (e.g. `{ "status": "Interview" }`) — `:id` is a **UUID** |
| `DELETE` | `/api/applications/:id` | Remove one row |
| `POST` | `/api/applications/seed-defaults` | Replace DB with canonical demo set (see below) |
| `POST` | `/api/auth/register` | Create account (when `JWT_SECRET` is set) |
| `POST` | `/api/auth/login` | Issue JWT |
| `GET` | `/api/auth/me` | Auth status / current user from `Authorization: Bearer …` |

`GET /health` — liveness check for Render.

When **`JWT_SECRET`** is set on the API, all `/api/applications` routes require a valid Bearer token; each user only sees their own rows (`user_id` on `applications`). Without `JWT_SECRET`, the API stays open (local demo / legacy behavior).

On startup the API runs **`CREATE TABLE IF NOT EXISTS applications (...)`** (see [`server/src/db/pool.js`](server/src/db/pool.js)).

## Prerequisites

- **Node.js 20+**
- **PostgreSQL 13+** (for `gen_random_uuid()` in the schema; Neon/Supabase are fine)

## Local development

### 1. Install dependencies

```bash
npm install
npm install --prefix server
```

### 2. Configure the API

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

- **`DATABASE_URL`** — Postgres URL (often includes `?sslmode=require` for cloud hosts)
- **`CLIENT_ORIGIN`** — `http://localhost:5173` for local Vite
- **`ENABLE_PUBLIC_SEED`** — optional; `true` if you want **Reset demo** to call the API in production (see deployment)
- **`JWT_SECRET`** — optional; set to enable register/login and per-user data
- **`JWT_EXPIRES_IN`** — optional; default `7d`

### 3. Seed PostgreSQL

```bash
npm run seed
```

Uses the same demo rows as [`src/demoSeed.js`](src/demoSeed.js) (~18 applications).

### 4. Run web + API

```bash
npm run dev
```

- **App:** `http://localhost:5173` — Vite proxies `/api` and `/health` to `http://localhost:4000`
- **API:** `http://localhost:4000`

Run separately if you prefer: `npm run dev:web` and `npm run dev:api`.

### Frontend-only fallback

If `GET /api/applications` fails (API down), the UI loads **offline demo** data and persists edits in **localStorage** until the API is reachable again.

## Production build (frontend)

```bash
npm run build
```

Static output: `dist/`. For Vercel, set **`VITE_API_URL`** to your public API origin (no trailing slash), e.g. `https://trackr-api.onrender.com`, so the browser calls the Render host directly (CORS must allow your Vercel URL — set `CLIENT_ORIGIN` on the API).

## Deployment

### PostgreSQL (managed)

Good fits for portfolios:

1. **[Neon](https://neon.tech)** — serverless Postgres, copy **`DATABASE_URL`**.  
2. **[Supabase](https://supabase.com)** — project settings → database URI.  
3. **[Railway](https://railway.app)** / **Render Postgres** — attach a DB service and copy the internal/external URL.

Use SSL (`sslmode=require` in the URL) when the provider expects it.

### API on Render

1. New **Web Service** → connect this repo.  
2. **Root directory:** `server`  
3. **Build command:** `npm install`  
4. **Start command:** `npm start`  
5. **Environment:**  
   - **`DATABASE_URL`**  
   - **`CLIENT_ORIGIN`** — your Vercel app URL(s), comma-separated if needed, e.g. `https://trackr.vercel.app`  
   - Optional: **`ENABLE_PUBLIC_SEED=true`** so **Reset demo** in the UI can call `POST /api/applications/seed-defaults` (otherwise that route returns **403** in production).  
   - **`JWT_SECRET`** — long random string so the live app uses sign-in (recommended for portfolio “real app” story).  
6. After first deploy, run **`npm run seed`** locally against the same **`DATABASE_URL`** **or** use **`ENABLE_PUBLIC_SEED`** briefly from the UI, then turn it off. With JWT enabled, register in the UI instead of relying on a global seed.

### CI (GitHub Actions)

On push/PR to `main` (or `master`), [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs:

- **Frontend:** `npm ci` → `npm run lint` → `npm run build`
- **API:** `npm ci` in `server/` → `node --check` on entry routes

Add a **CI passing** badge to your README or portfolio once the repo is on GitHub.

### Frontend on Vercel

1. Import repo; **Framework Preset:** Vite.  
2. **Build command:** `npm run build`  
3. **Output directory:** `dist`  
4. **Environment variables:** `VITE_API_URL=https://<your-render-service>.onrender.com` (your API base URL, no path suffix).

### Does this stack make sense?

Yes. **Vercel** + **Render** + **managed Postgres** (Neon/Supabase) is a very common portfolio split: static SPA, small Node API, relational DB with SQL and predictable deployments.

## Demo behavior

- **API available:** list/create/update/delete go to **PostgreSQL**; records use **UUID** primary keys; Kanban drag sends `PATCH` with `{ status }`.  
- **Reset demo:** re-seeds from `demoSeed.js` when the seed endpoint is allowed, else falls back to bundled offline data.  
- **API unavailable:** offline mode + `localStorage` for that browser session.

## Resume line

Built a full-stack internship/job tracker with **React**, **Node.js**, **Express**, **PostgreSQL**, **JWT auth**, and a **REST** API (CRUD + dashboard analytics), with **GitHub Actions CI** and deployment as a **static frontend** plus **hosted API**.

## License

MIT — use freely for your portfolio.
