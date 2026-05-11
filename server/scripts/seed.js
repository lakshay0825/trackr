import 'dotenv/config'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { createDemoApplicationDocs } from '../../src/demoSeed.js'
import { ApplicationModel } from '../src/models/Application.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error(
      `No MONGODB_URI. Create ${path.join(__dirname, '..', '.env')} from .env.example`,
    )
    process.exit(1)
  }

  await mongoose.connect(uri)

  const rows = createDemoApplicationDocs().map((r) => ({
    ...r,
    dateApplied: new Date(r.dateApplied),
    createdAt: new Date(r.createdAt),
  }))

  await ApplicationModel.deleteMany({})
  const inserted = await ApplicationModel.insertMany(rows)

  console.log(`Seeded ${inserted.length} applications`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
