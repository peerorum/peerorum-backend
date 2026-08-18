import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSignupModal } from '../../context/SignupModalContext'

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { open: openSignupModal } = useSignupModal()

  useEffect(() => {
    const token = searchParams.get('token')
    const role = searchParams.get('role')
    const uuid = searchParams.get('uuid')

    if (token) {
      localStorage.setItem('token', token)
      if (role) localStorage.setItem('role', role)
      if (uuid) localStorage.setItem('uuid', uuid)

      login({ name: 'User' }) // You can decode token or fetch profile later

      if (role === 'ROLE_GUEST') {
        openSignupModal('basic')
        navigate('/compare') // Or wherever the modal should float over
      } else {
        navigate('/mypage/specs')
      }
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate, login, openSignupModal])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500">로그인 처리 중입니다...</div>
    </div>
  )
}
