import { Briefcase, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: Briefcase },
]

export function Sidebar({ active, onNavigate }) {
  const [open, setOpen] = useState(false)

  const link = (item) => {
    const Icon = item.icon
    const isActive = active === item.id
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          onNavigate(item.id)
          setOpen(false)
        }}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
            : 'text-zinc-600 hover:bg-white/80 hover:text-zinc-900 hover:shadow-sm'
        }`}
      >
        <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
        {item.label}
      </button>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200/80 bg-white/85 px-4 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md">
            <Briefcase className="size-4" aria-hidden />
          </span>
          <span className="font-semibold tracking-tight text-zinc-900">
            Trackr
          </span>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/20 lg:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-14 z-40 w-56 border-r border-zinc-200/80 bg-white/75 backdrop-blur-xl transition-transform lg:top-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col px-3 py-4 lg:py-6">
          <div className="mb-8 hidden items-center gap-2 px-2 lg:flex">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md">
              <Briefcase className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-zinc-900">
                Trackr
              </p>
              <p className="text-xs text-zinc-500">Demo</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 pt-2 lg:pt-0" aria-label="Main">
            {NAV.map(link)}
          </nav>
          <p className="mt-auto hidden px-2 pt-6 text-xs leading-relaxed text-zinc-400 lg:block">
            Portfolio demo — data stays in your browser (localStorage).
          </p>
        </div>
      </aside>
    </>
  )
}
