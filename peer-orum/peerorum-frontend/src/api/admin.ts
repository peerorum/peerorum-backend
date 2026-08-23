import { api } from './axios'

export interface AdminDashboardData {
  totalUsers: number
  newSignups: number
  totalSpecCards: number
  reportCount: number
  recentSignups: Array<{ name: string; handle: string; time: string }>
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

export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get('/admin/dashboard')
  return response.data.data
}

export const fetchAdminUsers = async (page = 0, size = 10): Promise<AdminUserResponse> => {
  const response = await api.get(`/admin/users?page=${page}&size=${size}`)
  return response.data.data
}
