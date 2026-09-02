import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})

// 모든 API 요청에 Access Token 첨부
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('token')

  if (accessToken) {
    config.headers.Authorization =
      `Bearer ${accessToken}`
  }

  return config
})

// Response Interceptor: 만료된 Access Token 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url || ''
    const skipsRefresh = [
      '/auth/login',
      '/auth/signup',
      '/auth/refresh',
    ].some((path) => requestUrl.includes(path))

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !skipsRefresh
    ) {
      originalRequest._retry = true

      try {
        const baseURL = (api.defaults.baseURL || '/api')
          .replace(/\/$/, '')
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          null,
          {
            withCredentials: true,
          },
        )

        const newAccessToken =
          refreshResponse.data?.data?.accessToken

        const uuid =
          refreshResponse.data?.data?.uuid
        const role =
          refreshResponse.data?.data?.role
        const name =
          refreshResponse.data?.data?.name

        if (!newAccessToken) {
          throw new Error('새 Access Token이 없습니다.')
        }

        localStorage.setItem(
          'token',
          newAccessToken,
        )

        if (uuid) {
          localStorage.setItem('uuid', uuid)
        }

        if (role) {
          localStorage.setItem('role', role)
        }

        if (name) {
          localStorage.setItem('name', name)
        }

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('uuid')
        localStorage.removeItem('name')
        localStorage.removeItem('hasSpec')

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
