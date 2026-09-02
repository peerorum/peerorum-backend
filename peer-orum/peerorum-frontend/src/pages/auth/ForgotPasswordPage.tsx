import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <MailCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-[20px] font-bold text-ink-900">이메일을 확인해주세요</h1>
          <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-gray-500">
            <span className="font-semibold text-ink-900">{email}</span>로 비밀번호 재설정
            링크를 보냈어요.
          </p>
          <Link
            to="/login"
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            로그인으로 돌아가기
          </Link>
          <Link
            to="/reset-password"
            className="mt-3 block text-[12.5px] text-gray-400 hover:text-gray-600"
          >
            메일이 오지 않았나요? 재설정 링크 페이지로 바로 이동
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div>
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          로그인으로 돌아가기
        </Link>

        <h1 className="mt-4 text-[22px] font-bold text-ink-900">비밀번호 찾기</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-gray-500">
          가입하신 이메일 주소를 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드려요.
        </p>

        <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소를 입력해주세요"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            재설정 링크 보내기
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
