import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  ArrowLeft,
  Briefcase,
  Flag,
  Globe2,
  GraduationCap,
  Info,
  Lock,
  ShieldCheck,
  ThumbsUp,
  UserPlus,
  Users,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PenguinMascot from '../../components/ui/PenguinMascot'

const STAT_ROW = [
  { icon: GraduationCap, label: '학점 (4.5 만점)', value: '4.25 / 4.5', percentile: '상위 14%' },
  { icon: Globe2, label: '어학', value: 'TOEIC 900', percentile: '상위 20%' },
  { icon: Award, label: '자격증', value: '3개', percentile: '상위 6%' },
  { icon: Briefcase, label: '활동', value: '대외활동 3회 · 공모전 2회', percentile: '상위 18%' },
  { icon: Users, label: '인턴', value: '인턴 1회', percentile: '상위 38%' },
]

const GPA_DISTRIBUTION = [
  { range: '3.0', height: 18 },
  { range: '', height: 32 },
  { range: '3.5', height: 46 },
  { range: '', height: 68 },
  { range: '4.0', height: 100, active: true },
  { range: '', height: 54 },
  { range: '4.5', height: 20 },
]

const CERTS = ['CPA', '컴퓨터활용사', '회계관리 1급']

const SUMMARY_COMPARE = [
  { label: '학점', percentile: 14 },
  { label: '어학', percentile: 20 },
  { label: '자격증', percentile: 6 },
  { label: '활동', percentile: 18 },
  { label: '인턴', percentile: 38 },
]

export default function AnonymousProfileDetailPage() {
  const [activeTab, setActiveTab] = useState<'spec' | 'timeline'>('spec')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Link
          to="/compare"
          className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          비교 결과로 돌아가기
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.02]">
          <div className="flex items-center gap-4">
            <PenguinMascot className="h-14 w-14" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-ink-900">익명 5231</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
                  상위 14%
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-gray-500">
                경영학과 · 4학년 · 마케팅 희망
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11.5px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                피어오름 인증 데이터
                <Info className="h-3 w-3" />
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[13px] font-medium text-ink-900 hover:bg-gray-50">
              <UserPlus className="h-3.5 w-3.5" />
              관심 등록
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50">
              <Flag className="h-3.5 w-3.5" />
              이 학생을 신고하기
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {STAT_ROW.map((stat) => (
              <div key={stat.label} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                  <stat.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11.5px] text-gray-400">{stat.label}</p>
                  <p className="text-[13px] font-bold leading-snug text-ink-900">{stat.value}</p>
                  <p className="text-[10.5px] font-medium text-blue-600">{stat.percentile}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex gap-2">
              {(
                [
                  { key: 'spec', label: '상세 스펙' },
                  { key: 'timeline', label: '타임라인' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`border-b-2 px-1 pb-2.5 text-[14px] font-semibold transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'spec' ? (
              <div className="mt-4 flex flex-col gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <h3 className="text-[14.5px] font-bold text-ink-900">학점</h3>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-[20px] font-bold text-ink-900">4.25 / 4.5</span>
                    <span className="text-[12px] font-semibold text-blue-600">상위 14%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[94%] rounded-full bg-blue-600" />
                  </div>
                  <p className="mt-1 text-[11.5px] text-gray-400">전공 평균 4.30 / 4.5</p>

                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="mb-3 text-[12.5px] font-semibold text-gray-500">
                      학점 분포 (경영학과 4학년)
                    </p>
                    <div className="flex h-24 items-end gap-2">
                      {GPA_DISTRIBUTION.map((bar, index) => (
                        <div
                          key={index}
                          className="flex h-full flex-1 flex-col-reverse items-center gap-1"
                        >
                          <div
                            className={`w-full rounded-t ${bar.active ? 'bg-blue-600' : 'bg-gray-200'}`}
                            style={{ height: `${bar.height}%` }}
                          />
                          {bar.active && (
                            <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                              상위 14%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 flex justify-between text-[10.5px] text-gray-400">
                      <span>3.0</span>
                      <span>3.5</span>
                      <span>4.0</span>
                      <span>4.5</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Globe2 className="h-4 w-4" />
                    </span>
                    <h3 className="text-[14.5px] font-bold text-ink-900">어학</h3>
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13px] font-medium text-gray-500">TOEIC</span>
                        <span className="text-[12px] font-semibold text-blue-600">상위 20%</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[18px] font-bold text-ink-900">900</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full w-[90%] rounded-full bg-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-gray-500">OPIc</span>
                      <span className="text-[14px] font-bold text-ink-900">IH</span>
                      <span className="text-[12px] font-semibold text-blue-600">상위 31%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Award className="h-4 w-4" />
                      </span>
                      <h3 className="text-[14.5px] font-bold text-ink-900">자격증</h3>
                    </div>
                    <span className="text-[12.5px] text-gray-400">총 3개</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CERTS.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-[12.5px] font-medium text-ink-900"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <h3 className="text-[14.5px] font-bold text-ink-900">활동</h3>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[12.5px] text-gray-400">대외활동</p>
                      <p className="text-[13.5px] font-semibold text-ink-900">대외활동 3회</p>
                    </div>
                    <div>
                      <p className="text-[12.5px] text-gray-400">공모전</p>
                      <p className="text-[13.5px] font-semibold text-ink-900">공모전 2회 수상</p>
                    </div>
                  </div>
                  <button className="mt-3 text-[12px] font-medium text-blue-600 hover:underline">
                    더보기 &gt;
                  </button>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Users className="h-4 w-4" />
                    </span>
                    <h3 className="text-[14.5px] font-bold text-ink-900">인턴</h3>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[13.5px] font-semibold text-ink-900">인턴 경험</p>
                      <p className="text-[12.5px] text-gray-400">ABC 마케팅 인턴 (3개월)</p>
                    </div>
                    <span className="text-[12.5px] text-gray-400">2024.06 - 2024.08</span>
                  </div>
                </div>

                <p className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  <Lock className="h-3.5 w-3.5" />
                  모든 정보는 익명으로 보호되며, 허위 정보가 포함될 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-10 text-center text-[13.5px] text-gray-400 shadow-sm shadow-black/[0.02]">
                타임라인 정보가 아직 없어요.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
              <p className="flex items-center gap-1 text-[13.5px] font-bold text-ink-900">
                나와의 비교
                <Info className="h-3.5 w-3.5 text-gray-300" />
              </p>
              <p className="mt-2 text-[12px] text-gray-400">선택한 조건</p>
              <p className="text-[13px] font-medium text-ink-900">
                경영학과 · 4학년 · 마케팅 희망
              </p>
              <p className="text-[12px] text-gray-400">학점 범위 3.8 ~ 4.3</p>

              <div className="mt-4 rounded-xl bg-blue-50 p-3.5">
                <p className="text-[12.5px] leading-relaxed text-blue-700">
                  <span className="font-semibold">익명 5231</span>님은 선택한 조건의 학생 중{' '}
                  <span className="font-semibold">상위 14%</span>입니다.
                </p>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full w-[86%] rounded-full bg-blue-600" />
                </div>
                <div className="mt-1 flex justify-between text-[10.5px] text-blue-500">
                  <span>상위권</span>
                  <span>중위권</span>
                  <span>하위권</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
              <p className="text-[13.5px] font-bold text-ink-900">스펙 요약 비교</p>
              <div className="mt-3 flex flex-col gap-3">
                {SUMMARY_COMPARE.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-blue-600">상위 {item.percentile}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${100 - item.percentile}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
              <p className="text-[13.5px] font-bold text-ink-900">더 자세한 비교가 필요하다면?</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500">
                이 학생을 내 비교 목록에 추가하고 더 많은 학생들과 비교해보세요.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-[13px] font-semibold text-ink-900 hover:bg-gray-50">
                  <ThumbsUp className="h-3.5 w-3.5" />내 비교 목록에 추가
                </button>
                <Link
                  to="/compare"
                  className="rounded-lg bg-blue-600 py-2.5 text-center text-[13px] font-semibold text-white hover:bg-blue-700"
                >
                  다른 학생 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
