import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  clearAuthenticationSession,
  refreshAuthentication,
  saveAuthenticationSession,
} from '../../api/auth'

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()


  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) {
      return
    }

    handledRef.current = true

    const completeLogin = async () => {
      const token = searchParams.get('token')
      const role = searchParams.get('role')
      const uuid = searchParams.get('uuid')

      if (!token) {
        navigate('/login?error=oauth2_failed', { replace: true })
        return
      }

      localStorage.setItem('token', token)
      if (role) localStorage.setItem('role', role)
      if (uuid) localStorage.setItem('uuid', uuid)

      try {
        const session = await refreshAuthentication()
        saveAuthenticationSession(session)
        login({
          name: session.name,
          role: session.role,
          hasSpec: session.role !== 'ROLE_GUEST',
        })

        if (session.role === 'ROLE_GUEST') {
          navigate('/signup?mode=onboarding', { replace: true })
        } else if (session.role === 'ROLE_ADMIN') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/mypage/specs', { replace: true })
        }
      } catch (error) {
        console.error('Failed to complete OAuth2 login', error)
        clearAuthenticationSession()
        navigate('/login?error=oauth2_failed', { replace: true })
      }
    }

    void completeLogin()
  }, [
    searchParams,
    navigate,
    login,
  ])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500">
        로그인 처리 중입니다...
      </div>
    </div>
  )
}
