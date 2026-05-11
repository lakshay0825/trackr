import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createApplication as apiCreate,
  deleteApplication as apiDelete,
  listApplications,
  seedDefaultApplications,
  updateApplication as apiUpdate,
} from '../api/applicationsApi'
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

function normalizeRow(r) {
  const dateApplied =
    typeof r.dateApplied === 'string'
      ? r.dateApplied.slice(0, 10)
      : String(r.dateApplied ?? '')
  const createdAtRaw = r.createdAt ?? r.dateApplied
  const createdAt =
    typeof createdAtRaw === 'string'
      ? createdAtRaw.slice(0, 10)
      : String(createdAtRaw ?? '')
  return {
    id: String(r.id),
    company: String(r.company ?? ''),
    role: String(r.role ?? ''),
    status: r.status,
    dateApplied,
    notes: String(r.notes ?? ''),
    createdAt,
  }
}

function getOfflineInitial() {
  const saved = loadFromStorage()
  return saved?.length ? saved : createSampleApplications()
}

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState([])
  const [ready, setReady] = useState(false)
  const [useApi, setUseApi] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      try {
        const raw = await listApplications()
        if (!Array.isArray(raw)) throw new Error('invalid')
        if (!cancelled) {
          setApplications(raw.map(normalizeRow))
          setUseApi(true)
        }
      } catch {
        if (!cancelled) {
          setApplications(getOfflineInitial())
          setUseApi(false)
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready || useApi) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications, ready, useApi])

  const addApplication = useCallback(
    async (payload) => {
      const body = {
        company: payload.company.trim(),
        role: payload.role.trim(),
        status: payload.status,
        dateApplied: payload.dateApplied,
        notes: (payload.notes ?? '').trim(),
      }
      if (useApi) {
        const created = await apiCreate(body)
        setApplications((prev) => [normalizeRow(created), ...prev])
        return
      }
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `app-${Date.now()}`
      const createdAt = new Date().toISOString().slice(0, 10)
      setApplications((prev) => [
        { id, ...body, createdAt },
        ...prev,
      ])
    },
    [useApi],
  )

  const updateApplication = useCallback(
    async (id, payload) => {
      const body = {
        company: payload.company.trim(),
        role: payload.role.trim(),
        status: payload.status,
        dateApplied: payload.dateApplied,
        notes: (payload.notes ?? '').trim(),
      }
      if (useApi) {
        const updated = await apiUpdate(id, body)
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? normalizeRow(updated) : a)),
        )
        return
      }
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...body } : a)),
      )
    },
    [useApi],
  )

  const deleteApplication = useCallback(
    async (id) => {
      if (useApi) {
        await apiDelete(id)
        setApplications((prev) => prev.filter((a) => a.id !== id))
        return
      }
      setApplications((prev) => prev.filter((a) => a.id !== id))
    },
    [useApi],
  )

  const setApplicationStatus = useCallback(
    async (id, status) => {
      if (useApi) {
        const updated = await apiUpdate(id, { status })
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? normalizeRow(updated) : a)),
        )
        return
      }
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      )
    },
    [useApi],
  )

  const resetToDemo = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY)
    if (useApi) {
      try {
        const raw = await seedDefaultApplications()
        setApplications(raw.map(normalizeRow))
        return
      } catch (e) {
        setUseApi(false)
        setApplications(createSampleApplications())
        throw e
      }
    }
    setApplications(createSampleApplications())
  }, [useApi])

  const value = useMemo(
    () => ({
      applications,
      ready,
      useApi,
      addApplication,
      updateApplication,
      deleteApplication,
      setApplicationStatus,
      resetToDemo,
    }),
    [
      applications,
      ready,
      useApi,
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
