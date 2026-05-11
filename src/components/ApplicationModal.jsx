import { useState } from 'react'
import { APPLICATION_STATUSES } from '../constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const emptyForm = {
  company: '',
  role: '',
  status: 'Applied',
  dateApplied: '',
  notes: '',
}

function buildForm(initialValues) {
  const today = new Date().toISOString().slice(0, 10)
  if (initialValues) {
    return {
      company: initialValues.company ?? '',
      role: initialValues.role ?? '',
      status: initialValues.status ?? 'Applied',
      dateApplied: initialValues.dateApplied ?? today,
      notes: initialValues.notes ?? '',
    }
  }
  return {
    ...emptyForm,
    status: 'Applied',
    dateApplied: today,
    notes: '',
  }
}

const selectClass =
  'flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-[border,box-shadow] focus-visible:border-indigo-400 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-50'

export function ApplicationModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}) {
  const [form, setForm] = useState(() => buildForm(initialValues))
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    setSaving(true)
    try {
      await Promise.resolve(onSubmit(form))
      onClose()
    } catch (err) {
      console.error(err)
      window.alert(
        'Could not save. If you use the API, check that the server is running and CORS is configured.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="gap-0 p-0 sm:max-h-[min(640px,90vh)]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              required
              autoComplete="organization"
              placeholder="e.g. Acme Corp"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              required
              placeholder="e.g. Software Engineer Intern"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className={cn(selectClass)}
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date applied</Label>
              <Input
                id="dateApplied"
                type="date"
                required
                value={form.dateApplied}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateApplied: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="Recruiter name, next steps, links…"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
          <DialogFooter className="border-t-0 px-0 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? 'Saving…'
                : initialValues
                  ? 'Save changes'
                  : 'Add application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
