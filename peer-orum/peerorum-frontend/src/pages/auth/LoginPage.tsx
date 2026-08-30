import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/axios'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() === 'peeroreum1001@gmail.com' && password.trim() === 'vldjdhfma123@') {
      try {
        const res = await api.post('/auth/dev-login', { email: 'peeroreum1001@gmail.com' })
        localStorage.setItem('token', res.data.data.accessToken)
        login({ role: 'ROLE_ADMIN' })
        navigate('/admin')
      } catch (err) {
        alert('관리자 로그인 실패: ' + err)
      }
    } else {
      localStorage.setItem('token', 'mock-user-token')
      login({ role: 'ROLE_USER' })
      navigate('/compare')
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
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />

          <div className="flex items-center justify-between text-[13px]">
            <label className="flex items-center gap-1.5 text-gray-500">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300" />
              로그인 상태 유지
            </label>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              비밀번호 찾기
            </a>
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            로그인
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
