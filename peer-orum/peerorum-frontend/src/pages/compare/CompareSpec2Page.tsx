import { Link } from 'react-router-dom'
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Filter,
  Lightbulb,
  List,
  RotateCcw,
  Search,
} from 'lucide-react'
import PenguinMascot from '../../components/ui/PenguinMascot'
import Logo from '../../components/ui/Logo'
import Footer from '../../components/layout/Footer'
import ProfileMenu from '../../components/layout/ProfileMenu'
import RankBadge from '../../components/compare/RankBadge'
import RankPagination from '../../components/compare/RankPagination'
import { RANKED_STUDENTS, TOTAL_STUDENTS } from '../../data/mockRankings'

const HERO_STEPS = [
  { icon: Filter, label: '조건 선택' },
  { icon: List, label: '스펙 비교' },
  { icon: BarChart3, label: '나의 위치' },
]

const NAV_ITEMS = [
  { label: '스펙 비교', to: '/compare' },
  { label: '서비스 소개', to: '/#service-intro' },
  { label: '이용 방법', to: '/#how-to-use' },
  { label: '고객지원', to: '/#support' },
]

const GRADES = ['1학년', '2학년', '3학년', '4학년']
const GPA_RANGES = ['4.5 ~ 4.0', '3.9 ~ 3.5', '3.4 ~ 3.0', '2.9 ~ 2.5', '2.4 이하']

const SELECTED_CONDITIONS = ['경영학과', '4학년', '학점 4.5 ~ 4.0']

export default function CompareSpec2Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-br from-blue-500 to-blue-700 pb-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <Logo variant="white" />
            </Link>
            <nav className="hidden items-center gap-9 md:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-[15px] font-medium text-white/90 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ProfileMenu variant="dark" />
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
            <div>
              <h1 className="text-[26px] font-bold leading-snug text-white">
                비교할 조건을 선택하고
                <br />
                익명 스펙을 확인해보세요
              </h1>
              <p className="mt-2 text-[13.5px] text-white/80">
                같은 조건의 학생들이 어디까지 왔는지 확인하고,
                <br />
                나의 위치를 파악해보세요.
              </p>
            </div>

            <div className="flex items-center">
              {HERO_STEPS.map((step, index) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        index === 0 ? 'bg-white text-blue-600' : 'bg-white/15 text-white'
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[12px] font-medium text-white/90">{step.label}</span>
                  </div>
                  {index < HERO_STEPS.length - 1 && <div className="mx-3 mb-6 h-px w-10 bg-white/30" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
          <p className="mb-4 text-[14px] font-bold text-ink-900">비교 조건 선택</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">
                1. 학과 선택
              </label>
              <div className="relative">
                <select
                  defaultValue="경영학과"
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] text-ink-900 outline-none focus:border-blue-500"
                >
                  <option>경영학과</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">
                2. 학년 선택
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    className={`rounded-lg border py-2 text-[12px] font-medium ${
                      grade === '4학년'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">
                3. 세부 전공 (선택)
              </label>
              <div className="relative">
                <select
                  defaultValue=""
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] text-gray-400 outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    세부 전공을 선택하세요
                  </option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">
                4. 비교 기준
              </label>
              <div className="relative">
                <select
                  defaultValue="전체"
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] text-ink-900 outline-none focus:border-blue-500"
                >
                  <option>전체</option>
                  <option>전공 학점만</option>
                  <option>평균 학점만</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">
                5. 학점 구간 선택
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {GPA_RANGES.map((range) => (
                  <button
                    key={range}
                    className={`rounded-lg border px-2 py-2 text-[12px] font-medium ${
                      range === '4.5 ~ 4.0'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <p className="rounded-lg bg-gray-50 p-3 text-[11.5px] leading-relaxed text-gray-400">
              조건에 맞는 익명 데이터를 기반으로 참여됩니다.
            </p>

            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-3 text-[14px] font-semibold text-white hover:bg-blue-700">
              <Search className="h-4 w-4" />
              스펙 비교하기 →
            </button>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-50">
              <RotateCcw className="h-3.5 w-3.5" />
              조건 초기화
            </button>
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500">
              {SELECTED_CONDITIONS.map((condition, index) => (
                <span key={condition} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gray-300">|</span>}
                  <span className="font-medium text-ink-900">{condition}</span>
                </span>
              ))}
            </div>
            <button className="rounded-full border border-gray-200 px-3.5 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-50">
              조건 수정
            </button>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <p className="flex items-center gap-1 text-[15px] font-bold text-ink-900">
              학점 내림차순 (동일 조건 내)
            </p>
            <p className="text-[14px] font-bold text-ink-900">총 {TOTAL_STUDENTS}명</p>
          </div>

          <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm shadow-black/[0.02]">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[12px] text-gray-400">
                  <th className="px-4 py-3 font-medium">순위</th>
                  <th className="px-4 py-3 font-medium">익명 ID</th>
                  <th className="px-4 py-3 font-medium">학점 (4.5)</th>
                  <th className="px-4 py-3 font-medium">어학</th>
                  <th className="px-4 py-3 font-medium">자격증</th>
                  <th className="px-4 py-3 font-medium">교내활동</th>
                  <th className="px-4 py-3 font-medium">대외활동</th>
                  <th className="px-4 py-3 font-medium">인턴</th>
                  <th className="px-4 py-3 font-medium">기타 스펙</th>
                </tr>
              </thead>
              <tbody>
                {RANKED_STUDENTS.map((student) => (
                  <tr key={student.anonId} className="border-b border-gray-50 last:border-none">
                    <td className="px-4 py-3.5">
                      <RankBadge rank={student.rank} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <PenguinMascot className="h-8 w-8" />
                        <div>
                          <p className="text-[13px] font-semibold text-ink-900">{student.anonId}</p>
                          <p className="text-[11px] text-gray-400">{student.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13.5px] font-bold text-ink-900">{student.gpa}</p>
                      <p className="text-[11px] text-blue-600">상위 {student.gpaPercentile}%</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] text-ink-900">{student.lang}</p>
                      <p className="text-[11px] text-blue-600">상위 {student.langPercentile}%</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] text-ink-900">{student.certs}</p>
                      <p className="text-[11px] text-blue-600">상위 {student.certsPercentile}%</p>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-ink-900">
                      {Math.max(1, student.rank % 3 + 1)}개
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-ink-900">
                      {Math.max(1, (student.rank % 4) + 1)}개
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-ink-900">{student.intern}</td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <RankPagination />
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02] sm:flex-row sm:items-center">
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <Lightbulb className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-ink-900">
                  나의 스펙을 등록하고 정확한 비교를 받아보세요
                </p>
                <p className="text-[12.5px] text-gray-500">
                  내 스펙을 등록하면 나의 위치를 더 정확하게 확인할 수 있어요.
                </p>
              </div>
            </div>
            <Link
              to="/mypage/specs"
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-blue-700"
            >
              내 스펙 등록하기 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
