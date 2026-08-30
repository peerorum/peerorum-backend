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

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshResponse = await axios.post(
          '/api/auth/refresh',
          null,
          {
            withCredentials: true,
          },
        )

        const newAccessToken =
          refreshResponse.data?.data?.accessToken

        const uuid =
          refreshResponse.data?.data?.uuid

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

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('uuid')

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('uuid')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
