import axios from 'axios'

const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

/**
 * Dev: use relative `/api/...` so Vite proxies to Express.
 * Prod: set `VITE_API_URL` to your Render (or other) API origin, no trailing slash.
 */
export const api = axios.create({
  baseURL: base || undefined,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})
