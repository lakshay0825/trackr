import { Router } from 'express'
import { getPool } from '../db/pool.js'

const router = Router()

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

function isUuid(id) {
  return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(
    String(id),
  )
}

function isoDay(value) {
  if (value == null) return new Date().toISOString().slice(0, 10)
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

function toClient(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status,
    dateApplied: isoDay(row.date_applied),
    notes: row.notes ?? '',
    createdAt: isoDay(row.created_at),
  }
}

router.get('/', async (_req, res) => {
  try {
    const pool = getPool()
    const { rows } = await pool.query(
      `SELECT id, company, role, status, date_applied, notes, created_at
       FROM applications
       ORDER BY date_applied DESC`,
    )
    res.json(rows.map(toClient))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to list applications' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { company, role, status, dateApplied, notes } = req.body ?? {}
    if (!company?.trim() || !role?.trim()) {
      return res.status(400).json({ error: 'company and role are required' })
    }
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'invalid status' })
    }
    const da = dateApplied ? new Date(dateApplied) : new Date()
    if (Number.isNaN(da.getTime())) {
      return res.status(400).json({ error: 'invalid dateApplied' })
    }
    const ca = new Date()
    const pool = getPool()
    const { rows } = await pool.query(
      `INSERT INTO applications (company, role, status, date_applied, notes, created_at)
       VALUES ($1, $2, $3, $4::date, $5, $6::date)
       RETURNING id, company, role, status, date_applied, notes, created_at`,
      [
        String(company).trim(),
        String(role).trim(),
        status,
        isoDay(da),
        String(notes ?? '').trim(),
        isoDay(ca),
      ],
    )
    res.status(201).json(toClient(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create application' })
  }
})

router.post('/seed-defaults', async (_req, res) => {
  const allow =
    process.env.ENABLE_PUBLIC_SEED === 'true' ||
    process.env.NODE_ENV !== 'production'
  if (!allow) {
    return res.status(403).json({ error: 'Seed endpoint disabled in production' })
  }
  try {
    const { createDemoApplicationDocs } = await import(
      '../../../src/demoSeed.js'
    )
    const docs = createDemoApplicationDocs()
    const pool = getPool()
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
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }

    const { rows } = await pool.query(
      `SELECT id, company, role, status, date_applied, notes, created_at
       FROM applications
       ORDER BY date_applied DESC`,
    )
    res.json(rows.map(toClient))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to seed defaults' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isUuid(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const body = req.body ?? {}
    const sets = []
    const vals = []
    let i = 1

    if (body.company !== undefined) {
      sets.push(`company = $${i++}`)
      vals.push(String(body.company).trim())
    }
    if (body.role !== undefined) {
      sets.push(`role = $${i++}`)
      vals.push(String(body.role).trim())
    }
    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) {
        return res.status(400).json({ error: 'invalid status' })
      }
      sets.push(`status = $${i++}`)
      vals.push(body.status)
    }
    if (body.dateApplied !== undefined) {
      const da = new Date(body.dateApplied)
      if (Number.isNaN(da.getTime())) {
        return res.status(400).json({ error: 'invalid dateApplied' })
      }
      sets.push(`date_applied = $${i++}::date`)
      vals.push(isoDay(da))
    }
    if (body.notes !== undefined) {
      sets.push(`notes = $${i++}`)
      vals.push(String(body.notes).trim())
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'no fields to update' })
    }

    vals.push(id)
    const pool = getPool()
    const { rows } = await pool.query(
      `UPDATE applications SET ${sets.join(', ')}
       WHERE id = $${i}::uuid
       RETURNING id, company, role, status, date_applied, notes, created_at`,
      vals,
    )
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    res.json(toClient(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update application' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isUuid(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const pool = getPool()
    const { rowCount } = await pool.query(
      `DELETE FROM applications WHERE id = $1::uuid`,
      [id],
    )
    if (!rowCount) return res.status(404).json({ error: 'not found' })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete application' })
  }
})

export { router as applicationsRouter }
