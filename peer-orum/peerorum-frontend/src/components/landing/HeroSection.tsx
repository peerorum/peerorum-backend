import { Link } from 'react-router-dom'
import { ArrowRight, Lock, TrendingUp } from 'lucide-react'
import PhoneMockup from './PhoneMockup'
import InstagramIcon from '../ui/InstagramIcon'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-blue-50/60 to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="mb-5 inline-block text-[14px] font-semibold text-blue-600">
            대학생 스펙 비교 플랫폼
          </span>
          <h1 className="text-[40px] font-bold leading-tight tracking-tight text-ink-900 md:text-[44px]">
            나와 같은 조건의 학생들과
            <br />
            <span className="text-blue-600">나의 위치</span>를 확인하세요
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-gray-500">
            인증된 스펙 데이터를 기반으로
            <br />더 나은 성장 방향을 찾아보세요.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/compare"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
            >
              무료로 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://www.instagram.com/peer_oreum/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-gray-50"
            >
              <InstagramIcon className="h-4 w-4" />
              공식 인스타그램 보기
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-[13px] text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            모든 정보는 익명으로 안전하게 보호됩니다.
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative w-fit">
            <PhoneMockup />

            <div className="absolute -left-16 bottom-10 hidden w-56 rounded-2xl bg-white p-4 shadow-xl md:flex md:items-start md:gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <TrendingUp className="h-4 w-4" />
              </span>
              <p className="text-[12.5px] font-medium leading-snug text-ink-900">
                같은 조건의 학생들과 비교하고 성장하세요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
