import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { createDemoApplicationDocs } from '../../src/demoSeed.js'
import { ensureSchema, getPool } from '../src/db/pool.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function seed() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error(
      `No DATABASE_URL. Create ${path.join(__dirname, '..', '.env')} from .env.example`,
    )
    process.exit(1)
  }

  const pool = getPool()
  await ensureSchema(pool)

  const docs = createDemoApplicationDocs()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM applications')
    for (const r of docs) {
      await client.query(
        `INSERT INTO applications (company, role, status, date_applied, notes, created_at)
         VALUES ($1, $2, $3, $4::date, $5, $6::date)`,
        [
          r.company,
          r.role,
          r.status,
          r.dateApplied,
          String(r.notes ?? ''),
          r.createdAt,
        ],
      )
    }
    await client.query('COMMIT')
    console.log(`Seeded ${docs.length} applications`)
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
