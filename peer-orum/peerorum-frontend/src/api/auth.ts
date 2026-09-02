import axios from 'axios'
import type { UserRole } from '../context/AuthContext'
import { api } from './axios'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface AuthenticationSession {
  accessToken: string
  uuid: string
  role: UserRole
  name: string
}

export interface LocalSignupRequest {
  name: string
  email: string
  password: string
}

export interface LocalLoginRequest {
  email: string
  password: string
}

export async function signupLocal(
  request: LocalSignupRequest,
): Promise<AuthenticationSession> {
  const response = await api.post<ApiResponse<AuthenticationSession>>(
    '/auth/signup',
    request,
  )
  return response.data.data
}

export async function loginLocal(
  request: LocalLoginRequest,
): Promise<AuthenticationSession> {
  const response = await api.post<ApiResponse<AuthenticationSession>>(
    '/auth/login',
    request,
  )
  return response.data.data
}

export async function refreshAuthentication(): Promise<AuthenticationSession> {
  const response = await api.post<ApiResponse<AuthenticationSession>>(
    '/auth/refresh',
  )
  return response.data.data
}

export function saveAuthenticationSession(
  session: AuthenticationSession,
) {
  localStorage.setItem('token', session.accessToken)
  localStorage.setItem('uuid', session.uuid)
  localStorage.setItem('role', session.role)
  localStorage.setItem('name', session.name || 'User')
}

export function clearAuthenticationSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('uuid')
  localStorage.removeItem('name')
  localStorage.removeItem('hasSpec')
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const data = error.response?.data as {
    message?: string
    errors?: Array<{ reason?: string }>
  } | undefined

  return data?.errors?.[0]?.reason || data?.message || fallback
}
