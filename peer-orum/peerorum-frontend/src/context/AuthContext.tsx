import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthUser {
  name: string
  hasSpec: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (user?: Partial<AuthUser>) => void
  logout: () => void
  setHasSpec: (hasSpec: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const hasSpec = localStorage.getItem('hasSpec') === 'true'
      return { name: 'User', hasSpec }
    }
    return null
  })

  const login: AuthContextValue['login'] = useCallback((partial) => {
    const hasSpec = partial?.hasSpec ?? false
    localStorage.setItem('hasSpec', String(hasSpec))
    setUser({ name: partial?.name ?? 'User', hasSpec })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('uuid')
    localStorage.removeItem('hasSpec')
    setUser(null)
  }, [])

  const setHasSpec = useCallback((hasSpec: boolean) => {
    localStorage.setItem('hasSpec', String(hasSpec))
    setUser((prev) => (prev ? { ...prev, hasSpec } : prev))
  }, [])

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
