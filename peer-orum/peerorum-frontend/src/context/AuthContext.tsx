import { createContext, useContext, useState, type ReactNode } from 'react'
import { api } from '../api/axios'

interface AuthUser {
  name: string
  hasSpec: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (user?: Partial<AuthUser>) => void
  logout: () => Promise<void>
  setHasSpec: (hasSpec: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      return null
    }

    return {
      name: 'User',
      hasSpec: true,
    }
  })

  const login: AuthContextValue['login'] = (partial) => {
    setUser({ name: partial?.name ?? '유경', hasSpec: partial?.hasSpec ?? true })
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('uuid')
      setUser(null)
    }
  }

  const setHasSpec = (hasSpec: boolean) => {
    setUser((prev) => (prev ? { ...prev, hasSpec } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, login, logout, setHasSpec }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
