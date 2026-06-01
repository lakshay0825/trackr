import { useState } from 'react'
import { ApplicationsProvider } from './context/ApplicationsProvider'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './context/useAuth'
import { Layout } from './components/Layout'
import { DemoLoading } from './components/DemoLoading'
import { Dashboard } from './pages/Dashboard'
import { Applications } from './pages/Applications'
import { Login } from './pages/Login'

function AppShell() {
  const [view, setView] = useState('dashboard')

  return (
    <Layout activeView={view} onNavigate={setView}>
      {view === 'dashboard' ? <Dashboard /> : <Applications />}
    </Layout>
  )
}

function AppGate() {
  const { ready, authEnabled, isAuthenticated, user } = useAuth()

  if (!ready) {
    return <DemoLoading label="Loading…" />
  }

  if (authEnabled && !isAuthenticated) {
    return <Login />
  }

  return (
    <ApplicationsProvider key={user?.id ?? 'guest'}>
      <AppShell />
    </ApplicationsProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  )
}
