import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/axios'

export type UserRole =
  | 'ROLE_GUEST'
  | 'ROLE_USER'
  | 'ROLE_ADMIN'

interface AuthUser {
  name: string
  hasSpec: boolean
  role: UserRole
}

interface AuthContextValue {
  user: AuthUser | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (user?: Partial<AuthUser>) => void
  logout: () => Promise<void>
  setHasSpec: (hasSpec: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredRole(): UserRole {
  const role = localStorage.getItem('role')

  if (
    role === 'ROLE_GUEST' ||
    role === 'ROLE_USER' ||
    role === 'ROLE_ADMIN'
  ) {
    return role
  }

  return 'ROLE_USER'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      return null
    }

    return {
      name: 'User',
      hasSpec: localStorage.getItem('hasSpec') === 'true',
      role: getStoredRole(),
    }
  })

  const login: AuthContextValue['login'] = useCallback((partial) => {
    const hasSpec = partial?.hasSpec ?? false
    const role = partial?.role ?? getStoredRole()

    localStorage.setItem('hasSpec', String(hasSpec))
    localStorage.setItem('role', role)

    setUser({
      name: partial?.name ?? 'User',
      hasSpec,
      role,
    })
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('uuid')
      localStorage.removeItem('hasSpec')
      setUser(null)
    }
  }, [])

  const setHasSpec = useCallback((hasSpec: boolean) => {
    localStorage.setItem('hasSpec', String(hasSpec))
    setUser((prev) => (prev ? { ...prev, hasSpec } : prev))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        isAdmin: user?.role === 'ROLE_ADMIN',
        login,
        logout,
        setHasSpec,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}