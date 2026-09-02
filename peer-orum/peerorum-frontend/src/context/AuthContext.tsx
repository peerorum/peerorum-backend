import { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRole = 'user' | 'admin'

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
  logout: () => void
  setHasSpec: (hasSpec: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const login: AuthContextValue['login'] = (partial) => {
    setUser({
      name: partial?.name ?? '유경',
      hasSpec: partial?.hasSpec ?? true,
      role: partial?.role ?? 'user',
    })
  }

  const logout = () => setUser(null)

  const setHasSpec = (hasSpec: boolean) => {
    setUser((prev) => (prev ? { ...prev, hasSpec } : prev))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        isAdmin: user?.role === 'admin',
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
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
