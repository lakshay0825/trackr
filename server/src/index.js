import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { applicationsRouter } from './routes/applications.js'
import { ensureSchema, getPool } from './db/pool.js'

const PORT = Number(process.env.PORT) || 4000
const app = express()

const origins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: origins.length ? origins : true,
    credentials: false,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'trackr-api' })
})

app.use('/api/applications', applicationsRouter)

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error(
      'Missing DATABASE_URL — copy server/.env.example to server/.env',
    )
    process.exit(1)
  }

  const pool = getPool()
  await ensureSchema(pool)

  const { rows } = await pool.query('SELECT NOW() as now')
  console.log('PostgreSQL connected', rows[0]?.now ? '✓' : '')

  app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`)
    console.log('REST: GET/POST/PATCH/DELETE /api/applications …')
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
