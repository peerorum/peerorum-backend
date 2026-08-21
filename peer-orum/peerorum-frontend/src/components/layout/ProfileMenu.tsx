import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const MENU_ITEMS = [
  { label: '마이페이지', to: '/mypage/specs', icon: User },
  { label: '계정설정', to: '#', icon: Settings },
  { label: '알림설정', to: '#', icon: Bell },
]

export default function ProfileMenu({
  variant = 'light',
}: {
  variant?: 'light' | 'dark'
}) {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onClickOutside = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', onClickOutside)

    return () => {
      window.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  if (!user) return null

  const isDark = variant === 'dark'

  const handleLogout = async () => {
    setOpen(false)

    try {
      await logout()
    } finally {
      navigate('/')
    }
  }

  return (
    <div ref={rootRef} className="relative flex items-center gap-4">
      <button
        type="button"
        aria-label="알림"
        className={
          isDark
            ? 'text-white/80 hover:text-white'
            : 'text-gray-400 hover:text-gray-600'
        }
      >
        <Bell className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-1.5 text-[14px] font-medium ${
          isDark ? 'text-white' : 'text-ink-900'
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
            isDark
              ? 'bg-white/20 text-white'
              : 'bg-blue-600 text-white'
          }`}
        >
          {user.name.slice(0, 1)}
        </span>

        {user.name}님

        <ChevronDown
          className={`h-3.5 w-3.5 ${
            isDark ? 'opacity-80' : 'text-gray-400'
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 text-ink-900 shadow-xl">
          {isAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-blue-600 hover:bg-blue-50"
              >
                <span className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4" />
                  관리자 페이지
                </span>

                <ChevronRight className="h-3.5 w-3.5 text-blue-300" />
              </Link>

              <div className="my-1 border-t border-gray-100" />
            </>
          )}

          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-[14px] font-medium hover:bg-gray-50"
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4 text-gray-400" />
                {item.label}
              </span>

              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            </Link>
          ))}

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[14px] font-medium text-gray-500 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4 text-gray-400" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}