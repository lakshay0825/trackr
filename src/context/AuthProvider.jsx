import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchAuthStatus,
  login as apiLogin,
  register as apiRegister,
} from '../api/authApi'
import { api } from '../api/client'
import { AUTH_TOKEN_KEY } from '../constants'
import { AuthContext } from './authContext'

function readStoredToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken)
  const [user, setUser] = useState(null)
  const [authEnabled, setAuthEnabled] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common.Authorization
    }
  }, [token])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const status = await fetchAuthStatus()
        if (cancelled) return
        setAuthEnabled(Boolean(status.authEnabled))
        if (status.authEnabled && status.user) {
          setUser(status.user)
        } else if (!status.authEnabled) {
          setUser(null)
        } else if (token) {
          setToken(null)
          localStorage.removeItem(AUTH_TOKEN_KEY)
          setUser(null)
        }
      } catch {
        if (!cancelled) setAuthEnabled(false)
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token])

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
    api.defaults.headers.common.Authorization = `Bearer ${nextToken}`
  }, [])

  const login = useCallback(
    async (email, password) => {
      const data = await apiLogin(email, password)
      persistSession(data.token, data.user)
      return data.user
    },
    [persistSession],
  )

  const register = useCallback(
    async (email, password) => {
      const data = await apiRegister(email, password)
      persistSession(data.token, data.user)
      return data.user
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    delete api.defaults.headers.common.Authorization
  }, [])

  const value = useMemo(
    () => ({
      ready,
      authEnabled,
      user,
      token,
      isAuthenticated: !authEnabled || Boolean(user),
      login,
      register,
      logout,
    }),
    [ready, authEnabled, user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
