import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { useSignupModal } from '../../context/SignupModalContext'

export default function SignupPage() {
  const { open: openSignupModal } = useSignupModal()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    openSignupModal('basic')
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
            placeholder="이름을 입력해주세요"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="email"
            required
            placeholder="이메일을 입력해주세요"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="password"
            required
            placeholder="비밀번호를 입력해주세요"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          <input
            type="password"
            required
            placeholder="비밀번호를 한 번 더 입력해주세요"
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

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            회원가입
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
            onClick={() => {
              window.location.href =
                'http://localhost:8080/oauth2/authorization/google'
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-[14px] font-medium text-ink-900 hover:bg-gray-50"
          >
            <span className="text-[15px] font-bold text-[#4285F4]">G</span>
            Google로 가입하기
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                'http://localhost:8080/oauth2/authorization/kakao'
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#FEE500] py-3 text-[14px] font-medium text-[#191600] hover:brightness-95"
          >
            카카오로 가입하기
          </button>

          <button
            type="button"
            onClick={() => {
              alert('Apple 회원가입은 준비 중입니다.')
            }}
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
