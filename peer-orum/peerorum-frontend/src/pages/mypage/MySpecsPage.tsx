import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  Briefcase,
  Clock,
  FileEdit,
  GraduationCap,
  Globe2,
  History,
  Plus,
  Settings2,
  Trophy,
  Users,
} from 'lucide-react'
import MyPageLayout from '../../layouts/MyPageLayout'
import PenguinMascot from '../../components/ui/PenguinMascot'
import PenguinHero from '../../components/ui/PenguinHero'
import { useAuth } from '../../context/AuthContext'
import { fetchMyProfile } from '../../api/profile'
import type { MyProfileData } from '../../api/profile'

const REGISTERABLE_ITEMS = [
  { icon: GraduationCap, label: '학점', description: '재학중이거나 1학년일 경우 학점을 등록해요.' },
  { icon: Globe2, label: '어학', description: 'TOEIC, TOEFL, OPIc 등 어학 성적을 등록해요.' },
  { icon: Award, label: '자격증', description: '취득한 자격증과 유효기간을 등록해요.' },
  { icon: Briefcase, label: '대외활동', description: '대외활동 및 봉사활동을 등록해요.' },
  { icon: Users, label: '인턴', description: '인턴 경험을 등록해요.' },
  { icon: Trophy, label: '수상', description: '수상 내역과 성과를 등록해요.' },
]

function DetailCard({
  icon: Icon,
  title,
  onAdd,
  children,
}: {
  icon: typeof GraduationCap
  title: string
  onAdd?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-[14.5px] font-bold text-ink-900">{title}</h3>
        </div>
        {onAdd && (
          <button className="flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 hover:underline">
            <Plus className="h-3.5 w-3.5" />
            추가하기
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export default function MySpecsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<MyProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.hasSpec) {
      fetchMyProfile()
        .then(setProfile)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user?.hasSpec])

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-ink-900">내 스펙</h1>
            <p className="mt-1 text-[13.5px] text-gray-500">
              등록한 스펙을 관리하고, 성장 과정을 한눈에 확인해보세요.
            </p>
          </div>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[13px] font-medium text-ink-900 hover:bg-gray-50"
          >
            <Settings2 className="h-3.5 w-3.5" />
            스펙 공개 설정
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm shadow-black/[0.02]">
          <PenguinHero className="mx-auto h-28 w-28" />
          <h2 className="mt-5 text-[18px] font-bold text-ink-900">아직 등록된 스펙이 없어요</h2>
          <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-gray-500">
            학점, 어학, 자격증, 대외활동, 인턴, 수상 등
            <br />내 스펙을 등록하고 다른 학생들과 비교해보세요!
          </p>
          <button
            type="button"
            onClick={() => navigate('/mypage/specs/register')}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            스펙 등록하기
          </button>

          <p className="mt-8 text-[12.5px] font-medium text-gray-400">등록 가능한 항목</p>
          <div className="mx-auto mt-4 grid max-w-2xl grid-cols-3 gap-3 sm:grid-cols-6">
            {REGISTERABLE_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm shadow-black/[0.02]">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-[12px] font-semibold text-ink-900">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-gray-400">
            스펙을 등록할수록 더 정확한 비교와 분석이 가능해져요!
          </p>
        </div>
      </MyPageLayout>
    )
  }

  const SUMMARY_STATS = [
    { icon: GraduationCap, label: '학점', value: profile.gpa ? `${profile.gpa} / 4.5` : '-', percentile: '' },
    { icon: Globe2, label: '어학', value: profile.toeicScore ? `TOEIC ${profile.toeicScore}` : '-', percentile: '' },
    { icon: Award, label: '자격증', value: `${profile.certificates?.length || 0}개` },
    { icon: Briefcase, label: '대외활동', value: `${profile.activities?.length || 0}회` },
    { icon: Users, label: '인턴', value: '0회' }, // Placeholder as backend has no Intern entity yet
    { icon: Trophy, label: '수상', value: '0회' }, // Placeholder as backend has no Trophy entity yet
  ]

  return (
    <MyPageLayout>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-ink-900">내 스펙</h1>
          <p className="mt-1 text-[13.5px] text-gray-500">
            등록한 스펙을 관리하고, 성장 과정을 한눈에 확인해보세요.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[13px] font-medium text-ink-900 hover:bg-gray-50">
            <Settings2 className="h-3.5 w-3.5" />
            스펙 공개 설정
          </button>
          <button
            onClick={() => navigate('/mypage/specs/edit')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-blue-700"
          >
            <FileEdit className="h-3.5 w-3.5" />
            스펙 수정하기
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
        <div className="flex items-center gap-4">
          <PenguinMascot className="h-14 w-14" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-ink-900">{profile.name}</span>
            </div>
            <p className="mt-0.5 text-[13px] text-gray-500">
              {profile.university} {profile.major} {profile.entranceYear ? `${profile.entranceYear}학번` : ''} · {profile.desiredJob} 희망
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3 lg:grid-cols-6">
          {SUMMARY_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                <stat.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11.5px] text-gray-400">{stat.label}</p>
                <p className="text-[13px] font-bold text-ink-900">{stat.value}</p>
                {stat.percentile && (
                  <p className="text-[10.5px] text-blue-600">{stat.percentile}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-[16px] font-bold text-ink-900">상세 스펙</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard icon={GraduationCap} title="학업">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[20px] font-bold text-ink-900">{profile.gpa ? profile.gpa : 0} / 4.5</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${((profile.gpa || 0) / 4.5) * 100}%` }}
              />
            </div>
          </div>
        </DetailCard>

        <DetailCard icon={Globe2} title="어학">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-gray-500">TOEIC</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-ink-900">{profile.toeicScore || '-'}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${((profile.toeicScore || 0) / 990) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-gray-500">OPIc</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-ink-900">{profile.opicGrade || '-'}</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-gray-500">TOEIC Speaking</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-ink-900">{profile.toeicSpeakingGrade || '-'}</span>
              </div>
            </div>
          </div>
        </DetailCard>

        <DetailCard icon={Award} title="자격증" onAdd>
          {profile.certificates?.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {profile.certificates.map((cert) => (
                <li key={cert.id} className="flex items-center justify-between text-[13.5px]">
                  <span className="font-medium text-ink-900">{cert.certName}</span>
                  <span className="text-gray-400">{cert.issueDate}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-gray-400 text-center py-4">등록된 자격증이 없습니다.</p>
          )}
        </DetailCard>

        <DetailCard icon={Briefcase} title="대외활동" onAdd>
          {profile.activities?.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {profile.activities.map((activity) => (
                <li key={activity.id} className="text-[13.5px]">
                  <p className="font-medium text-ink-900">{activity.activityName}</p>
                  <p className="text-[12px] text-gray-400">인증키: {activity.authKey}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-gray-400 text-center py-4">등록된 대외활동이 없습니다.</p>
          )}
        </DetailCard>

        <DetailCard icon={Users} title="인턴 경험" onAdd>
          <p className="text-[13px] text-gray-400 text-center py-4">등록된 인턴 경험이 없습니다.</p>
        </DetailCard>

        <DetailCard icon={Trophy} title="수상" onAdd>
          <p className="text-[13px] text-gray-400 text-center py-4">등록된 수상 내역이 없습니다.</p>
        </DetailCard>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
            <History className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[14px] font-bold text-ink-900">나의 성장 기록</p>
            <p className="text-[12.5px] text-gray-500">
              스펙 등록 내역을 통해 성장 과정을 확인해보세요.
            </p>
          </div>
        </div>
        <button className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-ink-900 shadow-sm hover:bg-gray-100">
          성장 기록 보기
        </button>
      </div>
    </MyPageLayout>
  )
}
