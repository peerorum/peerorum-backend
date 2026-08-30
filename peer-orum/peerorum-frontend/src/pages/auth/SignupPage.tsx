import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useSignupModal } from '../../context/SignupModalContext'
import { useAuth } from '../../context/AuthContext'
import {
  getApiErrorMessage,
  saveAuthenticationSession,
  signupLocal,
} from '../../api/auth'

export default function SignupPage() {
  const { open: openSignupModal } = useSignupModal()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setIsSubmitting(true)

    try {
      const session = await signupLocal({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      saveAuthenticationSession(session)
      login({
        name: session.name,
        role: session.role,
        hasSpec: false,
      })
      openSignupModal('basic')
      navigate('/compare')
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[22px] font-bold text-ink-900">회원가입</h1>
        <p className="mt-1.5 text-[13.5px] text-gray-500">
          피어오름 계정을 만들어 서비스를 이용해보세요.
        </p>

        <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            maxLength={50}
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="email"
            required
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            placeholder="비밀번호를 입력해주세요 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            placeholder="비밀번호를 한 번 더 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />

          <label className="flex items-center gap-1.5 text-[12.5px] text-gray-500">
            <input type="checkbox" required className="h-3.5 w-3.5 rounded border-gray-300" />
            <span>
              이용약관 및 개인정보처리방침에 동의합니다.{' '}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                이용약관
              </a>{' '}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                개인정보처리방침
              </a>
            </span>
          </label>

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
            {isSubmitting ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[12px] text-gray-400">또는</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href="/oauth2/authorization/google"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[14px] font-medium text-ink-900 hover:bg-gray-50"
                  >
                    <span className="text-[15px] font-bold text-[#4285F4]">G</span>
                    Google로 가입하기
                  </a>

                  <a
                    href="/oauth2/authorization/kakao"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#FEE500] py-3 text-[14px] font-medium text-[#191600] hover:brightness-95"
                  >
                    카카오로 가입하기
                  </a>

                  <button
                    type="button"
                    onClick={() => alert('Apple 회원가입은 준비 중입니다.')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[14px] font-medium text-ink-900 hover:bg-gray-50"
                  >
                    Apple로 가입하기
                  </button>
                </div>

        <p className="mt-6 text-center text-[13px] text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
