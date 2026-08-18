import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Users, TrendingUp } from 'lucide-react'
import PenguinHero from '../components/ui/PenguinHero'
import Logo from '../components/ui/Logo'

const FEATURES = [
  { icon: ShieldCheck, title: '인증 기반 데이터', description: '신뢰할 수 있는 스펙 정보' },
  { icon: Users, title: '조건별 비교', description: '나와 비슷한 학생과 비교' },
  { icon: TrendingUp, title: '성장 한눈에', description: '나의 위치를 파악해요' },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-linear-to-b from-blue-50 via-blue-50/60 to-white px-10 py-10 md:flex">
          <div>
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            <h1 className="mt-10 text-[28px] font-bold leading-snug tracking-tight text-ink-900">
              나와 같은 조건의 학생들과
              <br />
              나의 위치를 확인하세요
            </h1>
            <p className="mt-4 text-[14px] leading-relaxed text-gray-500">
              인증된 스펙 데이터 기반의
              <br />
              대학생 스펙 비교 플랫폼, 피어오름
            </p>

            <div className="mt-6 flex justify-center">
              <PenguinHero className="h-44 w-44" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl bg-white/70 p-3.5 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <feature.icon className="h-4 w-4" />
                </span>
                <p className="mt-2 text-[12px] font-semibold text-ink-900">{feature.title}</p>
                <p className="mt-0.5 text-[10.5px] text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[12px] text-gray-400">© 2026 Peer Oreum. All rights reserved.</p>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>
      </div>
    </div>
  )
}
