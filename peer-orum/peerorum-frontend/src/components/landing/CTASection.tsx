import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Lock, ShieldCheck, Users } from 'lucide-react'
import PhoneMockup from './PhoneMockup'

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: '인증된 스펙',
    description: '증빙자료 기반 신뢰 데이터',
  },
  {
    icon: Users,
    title: '동일 조건 비교',
    description: '학교, 학과, 학년 등 같은 조건 비교',
  },
  {
    icon: Lock,
    title: '익명 정보 보호',
    description: '개인 정보는 보호되고 익명으로 관리',
  },
]

export default function CTASection() {
  return (
    <section className="bg-ink-950 px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
        <div>
          <span className="text-[14px] font-semibold text-blue-400">피어오름 시작하기</span>
          <h2 className="mt-3 text-[32px] font-bold leading-snug text-white">
            나의 위치를 알고
            <br />
            성장 방향을 찾아보세요
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-400">
            인증된 대학생 스펙 데이터를 기반으로
            <br />
            같은 조건의 학생들과 비교해보세요.
          </p>

          <Link
            to="/compare"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-500"
          >
            무료로 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-850 border border-ink-700 text-blue-400">
                  <item.icon className="h-4.5 w-4.5" />
                </span>
                <p className="mt-3 text-[13.5px] font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative w-fit">
            <PhoneMockup />

            <div className="absolute -left-20 top-8 hidden w-40 items-center gap-2 rounded-xl bg-ink-850 border border-ink-700 p-3 shadow-xl md:flex">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <BarChart3 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] text-gray-400">비교 분석</p>
                <p className="text-[13px] font-bold text-white">상위 20%</p>
              </div>
            </div>

            <div className="absolute -right-10 bottom-16 hidden w-32 flex-col items-center gap-1 rounded-xl bg-ink-850 border border-ink-700 p-3 shadow-xl md:flex">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-[13px] font-bold text-white"
                style={{
                  background: 'conic-gradient(#015dfc 0% 82%, #23242f 82% 100%)',
                }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-850">
                  82%
                </span>
              </div>
              <p className="text-[11px] text-gray-400">이번 달 향상</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
