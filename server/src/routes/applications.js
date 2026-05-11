import mongoose from 'mongoose'
import { Router } from 'express'
import { ApplicationModel } from '../models/Application.js'

const router = Router()

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

function isoDay(d) {
  const x = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(x.getTime())) return new Date().toISOString().slice(0, 10)
  return x.toISOString().slice(0, 10)
}

function toClient(doc) {
  return {
    id: doc._id.toString(),
    company: doc.company,
    role: doc.role,
    status: doc.status,
    dateApplied: isoDay(doc.dateApplied),
    notes: doc.notes ?? '',
    createdAt: isoDay(doc.createdAt),
  }
}

router.get('/', async (_req, res) => {
  try {
    const docs = await ApplicationModel.find().sort({ dateApplied: -1 }).lean()
    res.json(docs.map((d) => toClient(d)))
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
    const doc = await ApplicationModel.create({
      company: String(company).trim(),
      role: String(role).trim(),
      status,
      dateApplied: da,
      notes: String(notes ?? '').trim(),
      createdAt: new Date(),
    })
    res.status(201).json(toClient(doc))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create application' })
  }
})

/** Must be registered before `/:id` routes. */
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
    const rows = createDemoApplicationDocs().map((r) => ({
      ...r,
      dateApplied: new Date(r.dateApplied),
      createdAt: new Date(r.createdAt),
    }))
    await ApplicationModel.deleteMany({})
    const inserted = await ApplicationModel.insertMany(rows)
    const docs = await ApplicationModel.find({
      _id: { $in: inserted.map((d) => d._id) },
    })
      .sort({ dateApplied: -1 })
      .lean()
    res.json(docs.map((d) => toClient(d)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to seed defaults' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const body = req.body ?? {}
    const update = {}
    if (body.company !== undefined) update.company = String(body.company).trim()
    if (body.role !== undefined) update.role = String(body.role).trim()
    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) {
        return res.status(400).json({ error: 'invalid status' })
      }
      update.status = body.status
    }
    if (body.dateApplied !== undefined) {
      const da = new Date(body.dateApplied)
      if (Number.isNaN(da.getTime())) {
        return res.status(400).json({ error: 'invalid dateApplied' })
      }
      update.dateApplied = da
    }
    if (body.notes !== undefined) update.notes = String(body.notes).trim()

    const doc = await ApplicationModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).lean()
    if (!doc) return res.status(404).json({ error: 'not found' })
    res.json(toClient(doc))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update application' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const result = await ApplicationModel.findByIdAndDelete(id)
    if (!result) return res.status(404).json({ error: 'not found' })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete application' })
  }
})

export { router as applicationsRouter }
