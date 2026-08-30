import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../context/AuthContext'
import { useSignupModal } from '../../context/SignupModalContext'
import {
  getApiErrorMessage,
  loginLocal,
  saveAuthenticationSession,
} from '../../api/auth'

function oauthErrorMessage(errorCode: string | null) {
  switch (errorCode) {
    case 'account_exists_with_local':
      return '이미 일반 회원가입으로 가입된 이메일입니다. 이메일로 로그인해주세요.'
    case 'account_exists_with_kakao':
      return '이미 카카오로 가입된 이메일입니다. 카카오로 로그인해주세요.'
    case 'account_exists_with_google':
      return '이미 Google로 가입된 이메일입니다. Google로 로그인해주세요.'
    case 'oauth2_failed':
      return '소셜 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
    default:
      return ''
  }
}

export default function LoginPage() {
  const { login } = useAuth()
  const { open: openSignupModal } = useSignupModal()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(
    () => oauthErrorMessage(searchParams.get('error')),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const session = await loginLocal({
        email: email.trim(),
        password,
      })

      saveAuthenticationSession(session)
      login({
        name: session.name,
        role: session.role,
        hasSpec: session.role !== 'ROLE_GUEST',
      })

      if (session.role === 'ROLE_ADMIN') {
        navigate('/admin')
      } else if (session.role === 'ROLE_GUEST') {
        openSignupModal('basic')
        navigate('/compare')
      } else {
        navigate('/mypage/specs')
      }
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[22px] font-bold text-ink-900">로그인</h1>

        <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일 주소를 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />

          <div className="flex items-center justify-between text-[13px]">
            <label className="flex items-center gap-1.5 text-gray-500">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300" />
              로그인 상태 유지
            </label>
            <button
              type="button"
              onClick={() => alert('비밀번호 찾기는 준비 중입니다.')}
              className="text-gray-400 hover:text-gray-600"
            >
              비밀번호 찾기
            </button>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[12px] text-gray-400">또는</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => window.location.href = '/oauth2/authorization/google'}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[14px] font-medium text-ink-900 hover:bg-gray-50"
          >
            <span className="text-[15px] font-bold text-[#4285F4]">G</span>
            Google로 계속하기
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/oauth2/authorization/kakao'}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#FEE500] py-3 text-[14px] font-medium text-[#191600] hover:brightness-95"
          >
            카카오로 계속하기
          </button>
          <button
            type="button"
            onClick={() => alert('Apple 로그인은 준비 중입니다.')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[14px] font-medium text-ink-900 hover:bg-gray-50"
          >
            Apple로 계속하기
          </button>
        </div>

        <p className="mt-6 text-center text-[13px] text-gray-500">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
