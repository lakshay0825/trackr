import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { format, parseISO } from 'date-fns'
import { GripVertical } from 'lucide-react'
import { useMemo, useState } from 'react'
import { APPLICATION_STATUSES, STATUS_STYLES } from '../constants'
import { cn } from '@/lib/utils'

function resolveDropStatus(overId, applications) {
  if (!overId) return null
  const sid = String(overId)
  if (APPLICATION_STATUSES.includes(sid)) return sid
  const row = applications.find((a) => a.id === sid)
  return row?.status ?? null
}

function DroppableColumn({ status, count, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const col = STATUS_STYLES[status]

  return (
    <div
      className={cn(
        'flex max-h-[min(72vh,620px)] min-h-0 flex-col rounded-2xl border bg-white/90 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm transition-[box-shadow] duration-200',
        col.column,
        isOver && 'shadow-md ring-2 ring-indigo-400/40',
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100/90 px-3 py-3">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-700">
          <span className={cn('size-2 rounded-full', col.dot)} />
          {status}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold tabular-nums text-zinc-600 shadow-sm ring-1 ring-zinc-200/80">
          {count}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="thin-scrollbar flex min-h-[200px] flex-1 flex-col gap-2 overflow-y-auto p-2"
      >
        {children}
      </div>
    </div>
  )
}

function DraggableCard({ app, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: app.id })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-sm transition-[opacity,box-shadow] duration-200 hover:border-zinc-300 hover:shadow-md',
        isDragging && 'opacity-45 shadow-lg ring-2 ring-indigo-500/25',
      )}
    >
      <button
        type="button"
        className="touch-none cursor-grab rounded-l-xl border-r border-zinc-100 bg-zinc-50/80 p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 active:cursor-grabbing"
        {...listeners}
        {...attributes}
        aria-label={`Drag ${app.company} to another column`}
      >
        <GripVertical className="size-4 shrink-0" aria-hidden />
      </button>
      <button
        type="button"
        className="min-w-0 flex-1 px-3 py-3 text-left transition-colors hover:bg-indigo-50/40"
        onClick={() => onEdit(app)}
      >
        <p className="font-semibold leading-tight tracking-tight text-zinc-900">
          {app.company}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-zinc-600">
          {app.role}
        </p>
        <p className="mt-2 text-[11px] tabular-nums text-zinc-400">
          Applied {format(parseISO(app.dateApplied), 'MMM d')}
        </p>
      </button>
    </div>
  )
}

export function KanbanBoard({ applications, onStatusChange, onEdit }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const [activeId, setActiveId] = useState(null)

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(
      APPLICATION_STATUSES.map((s) => [s, []]),
    )
    for (const app of applications) {
      if (map[app.status]) map[app.status].push(app)
    }
    for (const s of APPLICATION_STATUSES) {
      map[s].sort((a, b) => parseISO(b.dateApplied) - parseISO(a.dateApplied))
    }
    return map
  }, [applications])

  const activeApp = activeId
    ? applications.find((a) => a.id === activeId)
    : null

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const nextStatus = resolveDropStatus(over.id, applications)
    if (!nextStatus) return
    const current = applications.find((a) => a.id === active.id)
    if (current && current.status !== nextStatus) {
      void Promise.resolve(onStatusChange(active.id, nextStatus)).catch(
        (err) => {
          console.error(err)
          window.alert('Could not update status. Check the API connection.')
        },
      )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {APPLICATION_STATUSES.map((status) => {
          const items = byStatus[status]
          return (
            <DroppableColumn key={status} status={status} count={items.length}>
              {items.map((app) => (
                <DraggableCard key={app.id} app={app} onEdit={onEdit} />
              ))}
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200/80 bg-white/50 px-3 py-8 text-center text-xs text-zinc-400">
                  Drop cards here
                </div>
              ) : null}
            </DroppableColumn>
          )
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeApp ? (
          <div className="w-[min(100vw-2rem,260px)] cursor-grabbing rounded-xl border border-zinc-200 bg-white p-3 shadow-2xl ring-2 ring-indigo-500/25">
            <p className="font-semibold text-zinc-900">{activeApp.company}</p>
            <p className="mt-1 line-clamp-2 text-xs text-zinc-600">{activeApp.role}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
