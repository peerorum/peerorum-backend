import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  ArrowUpDown,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Lock,
  MinusCircle,
  Target,
  UserPen,
  Users,
} from 'lucide-react'
import MyPageLayout from '../../layouts/MyPageLayout'
import PenguinMascot from '../../components/ui/PenguinMascot'
import PenguinHero from '../../components/ui/PenguinHero'
import { useAuth } from '../../context/AuthContext'
import { fetchMyProfile } from '../../api/profile'
import type { MyProfileData } from '../../api/profile'

const TABS = ['전체', '인증 완료', '인증 대기', '인증 반려']

const STATUS_STYLE: Record<string, string> = {
  완료: 'bg-emerald-50 text-emerald-600',
  대기: 'bg-amber-50 text-amber-600',
  반려: 'bg-red-50 text-red-600',
}

export default function VerificationStatusPage() {
  const [activeTab, setActiveTab] = useState('전체')
  const { user, setHasSpec } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<MyProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyProfile()
      .then((data) => {
        setProfile(data)
        setHasSpec(true)
      })
      .catch((err) => {
        console.error(err)
        setHasSpec(false)
      })
      .finally(() => setLoading(false))
  }, [setHasSpec])

  if (loading) {
    return (
      <MyPageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
        </div>
      </MyPageLayout>
    )
  }

  if (!user?.hasSpec || !profile) {
    return (
      <MyPageLayout>
        <div>
          <h1 className="text-[22px] font-bold text-ink-900">인증 현황</h1>
          <p className="mt-1 text-[13.5px] text-gray-500">
            내가 등록한 스펙의 인증 상태를 확인할 수 있어요.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm shadow-black/[0.02]">
          <PenguinHero className="mx-auto h-28 w-28" />
          <h2 className="mt-5 text-[18px] font-bold text-ink-900">아직 등록된 스펙이 없어요</h2>
          <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-gray-500">
            스펙을 등록하면 인증 진행 상태를 이곳에서 확인할 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => navigate('/mypage/specs/register')}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            스펙 등록하기
          </button>
        </div>
      </MyPageLayout>
    )
  }

  const PROFILE_FIELDS = [
    { icon: Building2, label: '학교', value: profile.university || '-' },
    { icon: FileText, label: '학과', value: profile.major || '-' },
    { icon: GraduationCap, label: '학번', value: profile.entranceYear ? `${profile.entranceYear}학번` : '-' },
    { icon: Target, label: '희망 직무', value: profile.desiredJob || '-' },
    { icon: Award, label: '학점', value: profile.gpa ? `${profile.gpa} / 4.5` : '-' },
  ]

  const items: any[] = []
  if (profile.gpa) {
    items.push({ icon: GraduationCap, item: '학점', content: `${profile.gpa} / 4.5`, status: '완료', date: '-' })
  }
  if (profile.toeicScore) {
    items.push({ icon: Users, item: '어학 (TOEIC)', content: `TOEIC ${profile.toeicScore}`, status: '완료', date: '-' })
  }
  if (profile.opicGrade) {
    items.push({ icon: Users, item: '어학 (OPIc)', content: `OPIc ${profile.opicGrade}`, status: '완료', date: '-' })
  }
  if (profile.toeicSpeakingGrade) {
    items.push({ icon: Users, item: '어학 (TOEIC Speaking)', content: `TOEIC Speaking ${profile.toeicSpeakingGrade}`, status: '완료', date: '-' })
  }
  
  profile.certificates?.forEach(cert => {
    let st = '대기'
    if (cert.status === 'VERIFIED') st = '완료'
    if (cert.status === 'REJECTED') st = '반려'
    items.push({ icon: Award, item: `자격증 (${cert.certName})`, content: cert.certName, status: st, date: cert.issueDate || '-' })
  })

  profile.activities?.forEach(act => {
    let st = '대기'
    if (act.status === 'VERIFIED') st = '완료'
    if (act.status === 'REJECTED') st = '반려'
    items.push({ icon: Briefcase, item: '대외활동', content: act.activityName, status: st, date: '-' })
  })

  const total = items.length
  const completed = items.filter(i => i.status === '완료').length
  const pending = items.filter(i => i.status === '대기').length
  const rejected = items.filter(i => i.status === '반려').length

  const SUMMARY = [
    { label: '총 등록 항목 수', value: total, icon: FileText, tone: 'bg-blue-50 text-blue-600' },
    { label: '인증 완료', value: completed, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600' },
    { label: '인증 대기', value: pending, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
    { label: '인증 반려', value: rejected, icon: MinusCircle, tone: 'bg-gray-100 text-gray-500' },
  ]

  const filtered =
    activeTab === '전체' ? items : items.filter((item) => `인증 ${item.status}` === activeTab)


  return (
    <MyPageLayout>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-ink-900">인증 현황</h1>
          <p className="mt-1 text-[13.5px] text-gray-500">
            내가 등록한 스펙의 인증 상태를 확인할 수 있어요.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-2 text-[12.5px] font-medium text-blue-600">
          <Lock className="h-3.5 w-3.5" />
          모든 정보는 익명으로 안전하게 보호됩니다.
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <PenguinMascot className="h-14 w-14" />
            <div>
              <span className="text-[16px] font-bold text-ink-900">{profile.name}</span>
              <p className="mt-0.5 text-[13px] text-gray-500">{profile.university} {profile.major} {profile.entranceYear ? `${profile.entranceYear}학번` : ''}</p>
            </div>
          </div>
          <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[13px] font-medium text-ink-900 hover:bg-gray-50">
            <UserPen className="h-3.5 w-3.5" />
            개인정보 수정
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-5">
          {PROFILE_FIELDS.map((field) => (
            <div key={field.label} className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                <field.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11.5px] text-gray-400">{field.label}</p>
                <p className="text-[13px] font-bold text-ink-900">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-[16px] font-bold text-ink-900">인증 현황 요약</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SUMMARY.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-black/[0.02]"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.tone}`}>
              <stat.icon className="h-4.5 w-4.5" />
            </span>
            <p className="mt-3 text-[22px] font-bold text-ink-900">{stat.value}</p>
            <p className="text-[12.5px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm shadow-black/[0.02]">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[12.5px] text-gray-400">
              <th className="px-5 py-3.5 font-medium">항목</th>
              <th className="px-5 py-3.5 font-medium">내용</th>
              <th className="px-5 py-3.5 font-medium">
                <span className="flex items-center gap-1">
                  인증 상태
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-5 py-3.5 font-medium">등록일</th>
              <th className="px-5 py-3.5 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-50 last:border-none">
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink-900">
                    <row.icon className="h-4 w-4 text-gray-400" />
                    {row.item}
                  </span>
                </td>
                <td className="px-5 py-4 text-[13.5px] text-ink-900">{row.content}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${STATUS_STYLE[row.status]}`}
                  >
                    인증 {row.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-[13px] text-gray-400">{row.date}</td>
                <td className="px-5 py-4">
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50">
                    {row.status === '반려' ? '다시 제출' : '상세보기'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl bg-blue-50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-600" />
          <p className="text-[13.5px] text-blue-700">
            <span className="font-semibold">인증이 반려되었나요?</span> 요청하신 인증이 반려된
            경우, 사유를 확인하고 다시 제출해주세요.
          </p>
        </div>
        <button className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-blue-700">
          반려 내역 확인하기 →
        </button>
      </div>
    </MyPageLayout>
  )
}
