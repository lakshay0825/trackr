import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
  },
  dateApplied: { type: Date, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, required: true },
})

export const ApplicationModel =
  mongoose.models.Application ??
  mongoose.model('Application', applicationSchema)
