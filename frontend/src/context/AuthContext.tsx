import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient, setAuthHeader } from '../services/apiClient'


export type Role = 'Admin' | 'Employee'

export type User = {
  id: number
  name: string
  email: string
  role?: { name?: Role; id?: number } | { name: Role } | { name: string } | null
  role_id?: number | null
  department?: { id?: number; name?: string } | null
}

export type AuthState = {
  token: string | null
  user: User | null
  role: Role | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
  refreshMe: () => Promise<User | null>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

function readToken(): string | null {
  try {
    return localStorage.getItem('auth_token')
  } catch {
    return null
  }
}

function readUser(): User | null {
  try {
    const raw = localStorage.getItem('auth_user')
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function deriveRole(user: User | null): Role | null {
  const r = user?.role as any
  if (!r) {
    if (user?.role_id === 1) return 'Admin'
    if (user?.role_id === 2) return 'Employee'
    return null
  }

  const name = typeof r === 'string' ? r : r?.name
  if (name === 'Admin' || name === 'Employee') return name
  return null
}

function getAuthUserPayload(data: any): User | null {
  if (!data) return null
  return (data.user ?? data.me ?? data) as User
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readToken())
  const [user, setUser] = useState<User | null>(() => readUser())
  const [loading, setLoading] = useState(false)

  const role = useMemo(() => deriveRole(user), [user])

  useEffect(() => {
      setAuthHeader(token)

  }, [token])

  const refreshMe = useCallback(async () => {
    if (!token) return null
    setLoading(true)
    try {
      const res = await apiClient.get('/auth/me')
      const payload = res.data?.data ?? res.data
      const nextUser = getAuthUserPayload(payload)
      if (nextUser) {
        setUser(nextUser)
        localStorage.setItem('auth_user', JSON.stringify(nextUser))
      }
      return nextUser
    } finally {
      setLoading(false)
    }
  }, [token])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await apiClient.post('/auth/login', { email, password })
      const payload = res.data?.data ?? res.data

      const nextToken: string | null = payload?.token ?? payload?.access_token ?? payload?.plainTextToken ?? null
      if (!nextToken) {
        throw new Error('Login succeeded but token not returned by API')
      }

      setToken(nextToken)
      setAuthHeader(nextToken)

      localStorage.setItem('auth_token', nextToken)

      let nextUser: User | null = getAuthUserPayload(payload)
      if (nextUser) {
        setUser(nextUser)
        localStorage.setItem('auth_user', JSON.stringify(nextUser))
      } else {
        nextUser = await refreshMe()
      }

      return nextUser
    } finally {
      setLoading(false)
    }
  }, [refreshMe])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      if (token) {
        await apiClient.post('/auth/logout', {})
      }
    } finally {
      setToken(null)
      setUser(null)
      setAuthHeader(null)

      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      } catch {}
      setLoading(false)
    }
  }, [token])

  const value = useMemo<AuthState>(
    () => ({ token, user, role, loading, login, logout, refreshMe }),
    [token, user, role, loading, login, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

