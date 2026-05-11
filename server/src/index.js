import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { applicationsRouter } from './routes/applications.js'

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
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('Missing MONGODB_URI — copy server/.env.example to server/.env')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('MongoDB connected')

  app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`)
    console.log('REST: GET/POST/PATCH/DELETE /api/applications …')
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
