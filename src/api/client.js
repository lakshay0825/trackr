import axios from 'axios'
import { AUTH_TOKEN_KEY } from '../constants'

const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

const storedToken = (() => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
})()

/**
 * Dev: use relative `/api/...` so Vite proxies to Express.
 * Prod: set `VITE_API_URL` to your Render (or other) API origin, no trailing slash.
 */
export const api = axios.create({
  baseURL: base || undefined,
  headers: {
    'Content-Type': 'application/json',
    ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
  },
  timeout: 15_000,
})
