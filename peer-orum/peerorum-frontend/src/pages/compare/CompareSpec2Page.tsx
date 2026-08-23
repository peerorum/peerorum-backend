import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
import { fetchSearchPeers } from '../../api/compare'
import type { CompareSpecProfile } from '../../api/compare'

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

export default function CompareSpec2Page() {
  const [profiles, setProfiles] = useState<CompareSpecProfile[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedMajor, setSelectedMajor] = useState('경영학과')
  const [selectedGrade, setSelectedGrade] = useState('4학년')
  const [selectedGpaRange, setSelectedGpaRange] = useState('4.5 ~ 4.0')
  const navigate = useNavigate()

  const handleSearch = async () => {
    setLoading(true)
    try {
      let minGpa: number | undefined
      let maxGpa: number | undefined
      if (selectedGpaRange === '4.5 ~ 4.0') { minGpa = 4.0; maxGpa = 4.5 }
      else if (selectedGpaRange === '3.9 ~ 3.5') { minGpa = 3.5; maxGpa = 3.9 }
      else if (selectedGpaRange === '3.4 ~ 3.0') { minGpa = 3.0; maxGpa = 3.4 }
      else if (selectedGpaRange === '2.9 ~ 2.5') { minGpa = 2.5; maxGpa = 2.9 }
      else if (selectedGpaRange === '2.4 이하') { minGpa = 0; maxGpa = 2.4 }

      const data = await fetchSearchPeers({
        major: selectedMajor,
        minGpa,
        maxGpa
      })
      setProfiles(data || [])
      setTotalCount(data?.length || 0)
    } catch (err) {
      console.error('Failed to fetch comparison data', err)
      setProfiles([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

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
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] text-ink-900 outline-none focus:border-blue-500"
                >
                  <option>경영학과</option>
                  <option>컴퓨터공학과</option>
                  <option>경제학과</option>
                  <option>전자공학과</option>
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
                    onClick={() => setSelectedGrade(grade)}
                    className={`rounded-lg border py-2 text-[12px] font-medium transition-colors ${
                      grade === selectedGrade
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
                3. 학점 구간 선택
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {GPA_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedGpaRange(range)}
                    className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors ${
                      range === selectedGpaRange
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

            <button 
              onClick={handleSearch}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-3 text-[14px] font-semibold text-white hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              스펙 비교하기 →
            </button>
            <button 
              onClick={() => {
                setSelectedMajor('경영학과')
                setSelectedGrade('4학년')
                setSelectedGpaRange('4.5 ~ 4.0')
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              조건 초기화
            </button>
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500">
              {[selectedMajor, selectedGrade, `학점 ${selectedGpaRange}`].map((condition, index) => (
                <span key={condition} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gray-300">|</span>}
                  <span className="font-medium text-ink-900">{condition}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <p className="flex items-center gap-1 text-[15px] font-bold text-ink-900">
              학점 내림차순 (동일 조건 내)
            </p>
            <p className="text-[14px] font-bold text-ink-900">총 {totalCount}명</p>
          </div>

          <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm shadow-black/[0.02]">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[12px] text-gray-400">
                  <th className="px-4 py-3 font-medium">순위</th>
                  <th className="px-4 py-3 font-medium">익명 ID</th>
                  <th className="px-4 py-3 font-medium">학점 (4.5)</th>
                  <th className="px-4 py-3 font-medium">어학</th>
                  <th className="px-4 py-3 font-medium">인증 여부</th>
                  <th className="px-4 py-3 font-medium">상세보기</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      데이터를 불러오는 중입니다...
                    </td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      해당 조건의 유저가 없습니다.
                    </td>
                  </tr>
                ) : profiles.map((student, index) => (
                  <tr 
                    key={student.anonymousUuid || index} 
                    className="border-b border-gray-50 last:border-none cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/compare/${student.anonymousUuid}`)}
                  >
                    <td className="px-4 py-3.5">
                      <RankBadge rank={index + 1} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <PenguinMascot className="h-8 w-8" />
                        <div>
                          <p className="text-[13px] font-semibold text-ink-900">
                            {student.virtualNickname || student.anonymousUuid?.substring(0, 8) || '익명'}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {student.major}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13.5px] font-bold text-ink-900">{student.gpa || '-'}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] text-ink-900">{student.toeicScore ? `TOEIC ${student.toeicScore}` : '없음'}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-ink-900">
                      {student.verificationCount > 0 ? (
                        <span className="text-blue-600 font-medium">{student.verificationCount}개 인증됨</span>
                      ) : (
                        <span className="text-gray-400">미인증</span>
                      )}
                    </td>
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
