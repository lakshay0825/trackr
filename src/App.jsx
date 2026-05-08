import { useState } from 'react'
import { ApplicationsProvider } from './context/ApplicationsProvider'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Applications } from './pages/Applications'

function AppShell() {
  const [view, setView] = useState('dashboard')

  return (
    <Layout activeView={view} onNavigate={setView}>
      {view === 'dashboard' ? <Dashboard /> : <Applications />}
    </Layout>
  )
}

export default function App() {
  return (
    <ApplicationsProvider>
      <AppShell />
    </ApplicationsProvider>
  )
}
