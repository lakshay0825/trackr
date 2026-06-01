import jwt from 'jsonwebtoken'

export function isAuthEnabled() {
  return Boolean(process.env.JWT_SECRET?.trim())
}

export function signToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d'
  return jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn })
}

export function requireAuth(req, res, next) {
  if (!isAuthEnabled()) return next()

  const header = req.headers.authorization
  const token =
    header?.startsWith('Bearer ') ? header.slice(7).trim() : null
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
