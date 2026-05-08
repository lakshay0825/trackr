# Trackr — Job Application Manager (Portfolio Demo)

**Trackr** is a SaaS-style **frontend-only** demo: dashboard analytics, table + draggable Kanban board, and full CRUD — **no login**, **no backend**.  
Sample roles (~18) load from bundled seed data; everything you change is saved in `**localStorage`** in this browser.

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4**
- **shadcn/ui-style** UI (`[src/components/ui](src/components/ui)`) — Radix Dialog, CVA, `cn()`
- **@dnd-kit** — drag cards between Applied / Interview / Offer / Rejected
- **Recharts**, **date-fns**, **lucide-react**

Seed definitions live in `[src/demoSeed.js](src/demoSeed.js)`; stable demo ids are applied in `[src/sampleData.js](src/sampleData.js)`.

## Prerequisites

- **Node.js 20+** recommended

## Setup & run

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Build & preview

```bash
npm run build
npm run preview
```

Output is static assets in `**dist/**` — deploy anywhere (Vercel, Netlify, GitHub Pages, etc.). No server or env vars required.

## Demo behavior

- **First visit:** shows the built-in sample applications (Google, Amazon, Microsoft, …).
- **Add / edit / delete / drag Kanban:** persisted in **localStorage** for this origin.
- **Reset demo:** clears local storage and restores the bundled sample list.

Status colors: Applied (blue), Interview (amber), Offer (green), Rejected (red).

## Resume line

Built a portfolio job-application tracker with **React** and **Vite**: dashboard metrics & charts, **@dnd-kit** Kanban workflow, shadcn-style UI, and **localStorage** persistence — **no auth**, static-deploy friendly.

## License

MIT — use freely for your portfolio.