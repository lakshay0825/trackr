import { Sidebar } from './Sidebar'
import { useAuth } from '../context/useAuth'

export function Layout({ activeView, onNavigate, children }) {
  const { authEnabled, user } = useAuth()
  return (
    <div className="min-h-dvh">
      <Sidebar active={activeView} onNavigate={onNavigate} />
      <div className="lg:pl-56">
        <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:py-10">
          {children}
        </main>
      </div>
      <p className="fixed bottom-0 left-0 right-0 border-t border-zinc-200/90 bg-white/90 px-4 py-2.5 text-center text-xs text-zinc-500 backdrop-blur-md lg:left-56">
        {authEnabled && user
          ? `Signed in as ${user.email}. Applications are private to your account.`
          : 'With the API running, changes sync to PostgreSQL; otherwise they stay in this browser (offline demo).'}
      </p>
    </div>
  )
}
