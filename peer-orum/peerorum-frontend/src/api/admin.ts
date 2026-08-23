import { api } from './axios'

export interface AdminDashboardData {
  totalUsers: number
  newSignups: number
  totalSpecCards: number
  reportCount: number
  recentSignups: Array<{ name: string; handle: string; time: string }>
  signupTrend: Array<{ date: string; count: number }>
  genderDistribution: Array<{ name: string; value: number; color: string }>
  recentReports: Array<{ id: string; type: string; reason: string; date: string; status: string }>
}

export interface AdminUserData {
  id: string
  name: string
  school: string
  major: string
  grade: string
  joinedAt: string
  status: '활성' | '휴면' | '정지'
  verified: '인증대기' | '인증완료'
}

export interface AdminUserResponse {
  users: AdminUserData[]
  totalElements: number
  totalPages: number
  currentPage: number
}

export interface AdminVerificationData {
  id: string
  name: string
  handle: string
  type: string
  file: string
  submittedAt: string
  status: '대기 중' | '검토 중' | '처리 완료' | '거절됨' | string
}

export interface AdminVerificationResponse {
  verifications: AdminVerificationData[]
  totalElements: number
}

export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get('/admin/dashboard')
  return response.data.data
}

export const fetchAdminUsers = async (page = 0, size = 10): Promise<AdminUserResponse> => {
  const response = await api.get(`/admin/users?page=${page}&size=${size}`)
  return response.data.data
}

export const fetchAdminVerifications = async (): Promise<AdminVerificationResponse> => {
  const response = await api.get('/admin/verifications')
  return response.data.data
}

export interface AdminSuspensionData {
  id: string
  name: string
  school: string
  type: '정지' | '탈퇴' | string
  reason: string
  requestedAt: string
  status: '대기 중' | '검토 중' | '처리 완료' | string
}

export interface AdminSuspensionResponse {
  suspensions: AdminSuspensionData[]
  totalElements: number
}

export const fetchAdminSuspensions = async (): Promise<AdminSuspensionResponse> => {
  const response = await api.get('/admin/suspensions')
  return response.data.data
}
