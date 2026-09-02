import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Bell, ChevronRight, Lock, UserPen } from 'lucide-react'
import MyPageLayout from '../../layouts/MyPageLayout'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../context/AuthContext'

function PasswordGate({ onVerified }: { onVerified: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim().length === 0) {
      setError('비밀번호를 입력해주세요.')
      return
    }
    setError('')
    onVerified()
  }

  return (
    <MyPageLayout>
      <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm shadow-black/[0.02]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-[18px] font-bold text-ink-900">본인 확인이 필요해요</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
          계정 설정 변경을 위해 비밀번호를 다시 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
          {error && <p className="text-left text-[11.5px] font-medium text-rose-500">{error}</p>}
          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-blue-600 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            확인
          </button>
        </form>
      </div>
    </MyPageLayout>
  )
}

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [verified, setVerified] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  const handleWithdraw = () => {
    setWithdrawOpen(false)
    logout()
    navigate('/')
  }

  if (!verified) {
    return <PasswordGate onVerified={() => setVerified(true)} />
  }

  return (
    <MyPageLayout>
      <div>
        <h1 className="text-[22px] font-bold text-ink-900">계정 설정</h1>
        <p className="mt-1 text-[13.5px] text-gray-500">
          개인정보, 알림 수신 여부, 회원 탈퇴를 관리할 수 있어요.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate('/mypage/verification/edit-info')}
          className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm shadow-black/[0.02] hover:bg-gray-50"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserPen className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[14px] font-bold text-ink-900">개인정보 수정</span>
              <span className="block text-[12.5px] text-gray-500">
                이름, 닉네임, 학교, 학과 등 기본 정보를 수정해요.
              </span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
        </button>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[14px] font-bold text-ink-900">알림 설정</span>
              <span className="block text-[12.5px] text-gray-500">
                이메일로 서비스 알림을 받아볼 수 있어요.
              </span>
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={() => setNotificationsEnabled((prev) => !prev)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            탈퇴 시 모든 스펙 및 인증 정보가 삭제되며 복구할 수 없어요.
          </span>
          <button
            type="button"
            onClick={() => setWithdrawOpen(true)}
            className="shrink-0 text-[12px] font-medium text-gray-400 underline-offset-2 hover:text-red-500 hover:underline"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      <Modal open={withdrawOpen} onClose={() => setWithdrawOpen(false)}>
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-[18px] font-bold text-ink-900">정말 탈퇴하시겠어요?</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-gray-500">
            탈퇴하면 등록한 모든 스펙과 인증 정보가 영구적으로 삭제되며,
            <br />
            이 작업은 되돌릴 수 없어요.
          </p>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setWithdrawOpen(false)}
              className="w-full rounded-xl border border-gray-200 py-3 text-[14px] font-semibold text-ink-900 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleWithdraw}
              className="w-full rounded-xl bg-red-500 py-3 text-[14px] font-semibold text-white hover:bg-red-600"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </Modal>
    </MyPageLayout>
  )
}
