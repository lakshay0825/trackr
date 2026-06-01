import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getPool } from '../db/pool.js'
import { isAuthEnabled, signToken } from '../middleware/auth.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/register', async (req, res) => {
  if (!isAuthEnabled()) {
    return res.status(503).json({ error: 'Auth is not configured on this server' })
  }

  try {
    const email = String(req.body?.email ?? '')
      .trim()
      .toLowerCase()
    const password = String(req.body?.password ?? '')

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const pool = getPool()
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email`,
      [email, passwordHash],
    )
    const user = rows[0]
    const token = signToken(user)
    res.status(201).json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' })
    }
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  if (!isAuthEnabled()) {
    return res.status(503).json({ error: 'Auth is not configured on this server' })
  }

  try {
    const email = String(req.body?.email ?? '')
      .trim()
      .toLowerCase()
    const password = String(req.body?.password ?? '')

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const pool = getPool()
    const { rows } = await pool.query(
      `SELECT id, email, password_hash FROM users WHERE email = $1`,
      [email],
    )
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken(user)
    res.json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', async (req, res) => {
  if (!isAuthEnabled()) {
    return res.json({ authEnabled: false })
  }

  const header = req.headers.authorization
  const token =
    header?.startsWith('Bearer ') ? header.slice(7).trim() : null
  if (!token) {
    return res.json({ authEnabled: true, user: null })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    res.json({
      authEnabled: true,
      user: { id: payload.sub, email: payload.email },
    })
  } catch {
    res.json({ authEnabled: true, user: null })
  }
})

export { router as authRouter }
