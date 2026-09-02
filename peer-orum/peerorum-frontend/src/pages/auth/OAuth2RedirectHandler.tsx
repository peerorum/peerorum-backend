import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSignupModal } from '../../context/SignupModalContext'

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { open: openSignupModal } = useSignupModal()

  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) {
      return
    }

    handledRef.current = true

    const token = searchParams.get('token')
    const role = searchParams.get('role')
    const uuid = searchParams.get('uuid')
    const normalizedRole =
      role === 'ROLE_GUEST' ||
      role === 'ROLE_USER' ||
      role === 'ROLE_ADMIN'
        ? role
        : 'ROLE_USER'

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    localStorage.setItem('token', token)

    localStorage.setItem('role', normalizedRole)

    if (uuid) {
      localStorage.setItem('uuid', uuid)
    }

    login({
      name: 'User',
      role: normalizedRole === 'ROLE_ADMIN' ? 'admin' : 'user',
      hasSpec: normalizedRole !== 'ROLE_GUEST',
    })

    if (normalizedRole === 'ROLE_GUEST') {
      openSignupModal('basic')
      navigate('/compare', { replace: true })
    } else if (normalizedRole === 'ROLE_ADMIN') {
      navigate('/admin', { replace: true })
    } else {
      navigate('/mypage/specs', { replace: true })
    }
  }, [
    searchParams,
    navigate,
    login,
    openSignupModal,
  ])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500">
        로그인 처리 중입니다...
      </div>
    </div>
  )
}
