import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 해요.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않아요.')
      return
    }
    setError('')
    setDone(true)
  }

  if (done) {
    return (
      <AuthLayout>
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-[20px] font-bold text-ink-900">비밀번호가 변경되었어요</h1>
          <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-gray-500">
            새로운 비밀번호로 다시 로그인해주세요.
          </p>
          <Link
            to="/login"
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            로그인하기
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[22px] font-bold text-ink-900">새 비밀번호 설정</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-gray-500">
          계정에서 사용할 새 비밀번호를 입력해주세요.
        </p>

        <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSubmit}>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호 (8자 이상)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          {error && <p className="text-[12.5px] text-red-500">{error}</p>}

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            비밀번호 변경하기
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
