import { format, parseISO } from 'date-fns'
import {
  Kanban,
  ListPlus,
  Pencil,
  RotateCcw,
  Table2,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { APPLICATION_STATUSES } from '../constants'
import { ApplicationModal } from '../components/ApplicationModal'
import { DemoLoading } from '../components/DemoLoading'
import { KanbanBoard } from '../components/KanbanBoard'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApplications } from '../context/useApplications'
import { cn } from '@/lib/utils'

export function Applications() {
  const {
    applications,
    ready,
    useApi,
    addApplication,
    updateApplication,
    deleteApplication,
    setApplicationStatus,
    resetToDemo,
  } = useApplications()

  const [view, setView] = useState('table')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalKey, setModalKey] = useState(0)
  const [editing, setEditing] = useState(null)
  const [resetting, setResetting] = useState(false)

  const sorted = useMemo(
    () =>
      [...applications].sort(
        (a, b) => parseISO(b.dateApplied) - parseISO(a.dateApplied),
      ),
    [applications],
  )

  const openAdd = () => {
    setEditing(null)
    setModalKey((k) => k + 1)
    setModalOpen(true)
  }

  const openEdit = (app) => {
    setEditing(app)
    setModalKey((k) => k + 1)
    setModalOpen(true)
  }

  const handleSubmit = async (form) => {
    if (editing) await updateApplication(editing.id, form)
    else await addApplication(form)
  }

  if (!ready) {
    return <DemoLoading label="Connecting to your data…" />
  }

  return (
    <div className="space-y-8 pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Applications
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
            Manage roles in a polished table or drag cards on the Kanban board.
            {useApi
              ? ' Changes sync to the API (PostgreSQL).'
              : ' Offline: changes stay in this browser (localStorage).'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-zinc-200/90 bg-white p-1 shadow-sm ring-1 ring-black/[0.03]">
            <button
              type="button"
              onClick={() => setView('table')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
                view === 'table'
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-50',
              )}
            >
              <Table2 className="size-3.5" aria-hidden />
              Table
            </button>
            <button
              type="button"
              onClick={() => setView('board')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
                view === 'board'
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-50',
              )}
            >
              <Kanban className="size-3.5" aria-hidden />
              Board
            </button>
          </div>
          <Button type="button" onClick={openAdd} className="gap-2 shadow-md">
            <ListPlus className="size-4" aria-hidden />
            Add application
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={resetting}
            className="gap-1.5"
            onClick={async () => {
              if (
                !window.confirm(
                  useApi
                    ? 'Replace all applications on the server with the default demo list?'
                    : 'Reset all data to the built-in sample applications?',
                )
              )
                return
              setResetting(true)
              try {
                await resetToDemo()
              } catch (e) {
                console.error(e)
                window.alert(
                  'Reset failed. For hosted APIs, set ENABLE_PUBLIC_SEED=true on the server or run npm run seed.',
                )
              } finally {
                setResetting(false)
              }
            }}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            {resetting ? 'Resetting…' : 'Reset demo'}
          </Button>
        </div>
      </div>

      {view === 'table' ? (
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="border-b border-zinc-100 bg-gradient-to-r from-white to-indigo-50/40 pb-4">
            <CardTitle className="text-lg">All applications</CardTitle>
            <CardDescription>
              {sorted.length} total · statuses: {APPLICATION_STATUSES.join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <TableContainer>
              <Table className="min-w-[680px]">
                <TableHeader className="border-b border-zinc-100 bg-zinc-50/90">
                  <TableRow className="border-0 bg-transparent hover:bg-transparent">
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date applied</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-16 text-center text-zinc-500">
                        No applications yet — add your first role.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sorted.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-semibold text-zinc-900">
                          {app.company}
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate text-zinc-700">
                          {app.role}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-zinc-600">
                          {format(parseISO(app.dateApplied), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="max-w-[240px] truncate text-zinc-500">
                          {app.notes || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-zinc-500 hover:text-zinc-900"
                              aria-label={`Edit ${app.company}`}
                              onClick={() => openEdit(app)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-zinc-500 hover:text-red-600"
                              aria-label={`Delete ${app.company}`}
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    `Remove application at ${app.company}?`,
                                  )
                                )
                                  return
                                try {
                                  await deleteApplication(app.id)
                                } catch (e) {
                                  console.error(e)
                                  window.alert('Could not delete. Check the API.')
                                }
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500">
            <span className="font-medium text-zinc-700">Tip:</span> drag the grip handle to move a card between Applied, Interview, Offer, and Rejected.
          </p>
          <KanbanBoard
            applications={applications}
            onStatusChange={setApplicationStatus}
            onEdit={openEdit}
          />
        </div>
      )}

      <ApplicationModal
        key={modalKey}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        title={editing ? 'Edit application' : 'New application'}
      />
    </div>
  )
}
