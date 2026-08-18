import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Request Interceptor: Attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
