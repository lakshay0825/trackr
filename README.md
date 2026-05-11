# Trackr — Job Application Manager

Portfolio-style **full-stack** demo: **React (Vite)** + **Node.js (Express)** + **MongoDB Atlas**, **REST API**, and deploy recipes for **Vercel** (frontend) + **Render** (API).  
**No login** — suitable for a public demo; add JWT in a later phase for real multi-tenant use.

## Architecture

| Layer | Tech |
|--------|------|
| UI | React 19, Vite 8, Tailwind v4, shadcn-style components, @dnd-kit, Recharts |
| API | Express.js, Mongoose, CORS |
| Data | MongoDB Atlas (or local `mongodb://`) |

### REST API (`/api/applications`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/applications` | List all (newest `dateApplied` first) |
| `POST` | `/api/applications` | Create (`company`, `role`, `status`, `dateApplied`, `notes`) |
| `PATCH` | `/api/applications/:id` | Partial update (e.g. `{ "status": "Interview" }`) |
| `DELETE` | `/api/applications/:id` | Remove one row |
| `POST` | `/api/applications/seed-defaults` | Replace DB with canonical demo set (see below) |

`GET /health` — liveness check for Render.

## Prerequisites

- **Node.js 20+**
- **MongoDB Atlas** cluster (free tier is fine) and a connection string

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

- `MONGODB_URI` — Atlas connection string (include database name if you like, e.g. `.../trackr`)
- `CLIENT_ORIGIN` — `http://localhost:5173` for local Vite
- `ENABLE_PUBLIC_SEED` — optional; `true` if you want **Reset demo** to call the API in production (see deployment)

### 3. Seed MongoDB

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

### MongoDB Atlas

1. Create a project and M0 cluster.  
2. Database Access → user + password.  
3. Network Access → allow `0.0.0.0/0` for a public API (tighten later) or Render’s outbound IPs if you use IP allowlisting.  
4. Copy **connection string** into `MONGODB_URI` (Render + local `server/.env`).

### API on Render

1. New **Web Service** → connect this repo.  
2. **Root directory:** `server`  
3. **Build command:** `npm install`  
4. **Start command:** `npm start`  
5. **Environment:**  
   - `MONGODB_URI`  
   - `CLIENT_ORIGIN` — your Vercel app URL(s), comma-separated if needed, e.g. `https://trackr.vercel.app`  
   - Optional: `ENABLE_PUBLIC_SEED=true` so **Reset demo** in the UI can call `POST /api/applications/seed-defaults` (otherwise that route returns **403** in production).  
6. After first deploy, run **`npm run seed`** locally pointed at the same Atlas URI **or** trigger seed from a trusted environment — or enable `ENABLE_PUBLIC_SEED` once, reset from the app, then turn it off.

### Frontend on Vercel

1. Import repo; **Framework Preset:** Vite.  
2. **Build command:** `npm run build`  
3. **Output directory:** `dist`  
4. **Environment variables:** `VITE_API_URL=https://<your-render-service>.onrender.com` (your API base URL, no path suffix).

### Does this stack make sense?

Yes. **Vercel** is ideal for the static/Vite app; **Render** (or Railway/Fly.io) fits a small **Express** process and persistent env secrets; **Atlas** is the standard managed **MongoDB** tier for hobby/portfolio projects. Same pattern scales to JWT + user-scoped collections later.

## Demo behavior

- **API available:** list/create/update/delete go to MongoDB; Kanban drag issues `PATCH` with `{ status }`.  
- **Reset demo:** re-seeds from `demoSeed.js` when the seed endpoint is allowed, else falls back to bundled offline data.  
- **API unavailable:** offline mode + `localStorage` for that browser session.

## Resume line

Built a full-stack internship/job tracker with **React**, **Node.js**, **Express**, **MongoDB Atlas**, and a **REST** API (CRUD + dashboard analytics), deployed as a **static frontend** and **hosted API** with a public portfolio demo.

## License

MIT — use freely for your portfolio.
