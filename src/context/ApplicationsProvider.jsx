import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { STORAGE_KEY } from '../constants'
import { createSampleApplications } from '../sampleData'
import { ApplicationsContext } from './applicationsContext'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function getInitialApplications() {
  const saved = loadFromStorage()
  return saved?.length ? saved : createSampleApplications()
}

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState(getInitialApplications)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const addApplication = useCallback((payload) => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `app-${Date.now()}`
    const createdAt = new Date().toISOString().slice(0, 10)
    setApplications((prev) => [
      {
        id,
        company: payload.company.trim(),
        role: payload.role.trim(),
        status: payload.status,
        dateApplied: payload.dateApplied,
        notes: (payload.notes ?? '').trim(),
        createdAt,
      },
      ...prev,
    ])
  }, [])

  const updateApplication = useCallback((id, payload) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              company: payload.company.trim(),
              role: payload.role.trim(),
              status: payload.status,
              dateApplied: payload.dateApplied,
              notes: (payload.notes ?? '').trim(),
            }
          : a,
      ),
    )
  }, [])

  const deleteApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const setApplicationStatus = useCallback((id, status) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    )
  }, [])

  const resetToDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setApplications(createSampleApplications())
  }, [])

  const value = useMemo(
    () => ({
      applications,
      addApplication,
      updateApplication,
      deleteApplication,
      setApplicationStatus,
      resetToDemo,
    }),
    [
      applications,
      addApplication,
      updateApplication,
      deleteApplication,
      setApplicationStatus,
      resetToDemo,
    ],
  )

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  )
}
