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

const REGISTERABLE_ITEMS = [
  { icon: GraduationCap, label: '학점', description: '재학중이거나 1학년일 경우 학점을 등록해요.' },
  { icon: Globe2, label: '어학', description: 'TOEIC, TOEFL, OPIc 등 어학 성적을 등록해요.' },
  { icon: Award, label: '자격증', description: '취득한 자격증과 유효기간을 등록해요.' },
  { icon: Briefcase, label: '대외활동', description: '대외활동 및 봉사활동을 등록해요.' },
  { icon: Users, label: '인턴', description: '인턴 경험을 등록해요.' },
  { icon: Trophy, label: '수상', description: '수상 내역과 성과를 등록해요.' },
]

const SUMMARY_STATS = [
  { icon: GraduationCap, label: '학점', value: '4.29 / 4.5', percentile: '상위 23%' },
  { icon: Globe2, label: '어학', value: 'TOEIC 780', percentile: '상위 31%' },
  { icon: Award, label: '자격증', value: '4개' },
  { icon: Briefcase, label: '대외활동', value: '3회' },
  { icon: Users, label: '인턴', value: '1회' },
  { icon: Trophy, label: '수상', value: '1회' },
]

const COURSES = [
  { name: '마케팅관리', grade: 'A+' },
  { name: '소비자행동론', grade: 'A+' },
  { name: '데이터분석', grade: 'A0' },
  { name: '경영전략', grade: 'A0' },
]

const CERTS = [
  { name: 'ADsP', date: '2024.05.10' },
  { name: '컴퓨터활용능력 2급', date: '2023.09.15' },
  { name: 'SQLD', date: '2024.01.20' },
  { name: '무역영어 1급', date: '2023.12.05' },
]

const ACTIVITIES = [
  { name: '교내 마케팅 서포터즈 3기', period: '2024.03 - 2024.11' },
  { name: '한국경제 대학생 기자단 21기', period: '2023.09 - 2024.02' },
  { name: '대학 연합 마케팅 컨퍼런스 운영진', period: '2023.05 - 2023.11' },
]

const INTERN_TASKS = [
  'SNS 콘텐츠 기획 및 운영',
  '시장 조사 및 경쟁사 분석',
  '프로모션 성과 분석 및 리포트 제작',
]

const AWARD_DETAILS = ['주최: 한국마케팅협회', '수상작: 대학생 잠재고객 브랜드 캠페인 제안']

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

  if (!user?.hasSpec) {
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
              <span className="text-[16px] font-bold text-ink-900">유경</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
                상위 23%
              </span>
            </div>
            <p className="mt-0.5 text-[13px] text-gray-500">
              단국대학교 경영학과 4학년 · 마케팅 희망
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
              <span className="text-[20px] font-bold text-ink-900">4.29 / 4.5</span>
              <span className="text-[12px] font-semibold text-blue-600">상위 23%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[95%] rounded-full bg-blue-600" />
            </div>
            <p className="mt-1.5 text-[11.5px] text-gray-400">전공 평균 3.65 / 4.5</p>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-3.5">
            <p className="mb-2 text-[12.5px] font-semibold text-gray-500">주요 수강 과목</p>
            <ul className="flex flex-col gap-1.5">
              {COURSES.map((course) => (
                <li key={course.name} className="flex justify-between text-[13px] text-ink-900">
                  <span>{course.name}</span>
                  <span className="font-semibold">{course.grade}</span>
                </li>
              ))}
            </ul>
            <button className="mt-2 text-[12px] font-medium text-blue-600 hover:underline">
              더보기 &gt;
            </button>
          </div>
        </DetailCard>

        <DetailCard icon={Globe2} title="어학">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-gray-500">TOEIC</span>
                <span className="text-[12px] font-semibold text-blue-600">상위 31%</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-ink-900">780</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[78%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-gray-500">OPIc</span>
                <span className="text-[12px] font-semibold text-blue-600">상위 28%</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-ink-900">IH</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[72%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </DetailCard>

        <DetailCard icon={Award} title="자격증" onAdd>
          <ul className="flex flex-col gap-2.5">
            {CERTS.map((cert) => (
              <li key={cert.name} className="flex items-center justify-between text-[13.5px]">
                <span className="font-medium text-ink-900">{cert.name}</span>
                <span className="text-gray-400">{cert.date}</span>
              </li>
            ))}
          </ul>
        </DetailCard>

        <DetailCard icon={Briefcase} title="대외활동" onAdd>
          <ul className="flex flex-col gap-2.5">
            {ACTIVITIES.map((activity) => (
              <li key={activity.name} className="text-[13.5px]">
                <p className="font-medium text-ink-900">{activity.name}</p>
                <p className="text-[12px] text-gray-400">{activity.period}</p>
              </li>
            ))}
          </ul>
          <button className="mt-3 text-[12px] font-medium text-blue-600 hover:underline">
            더보기 &gt;
          </button>
        </DetailCard>

        <DetailCard icon={Users} title="인턴 경험" onAdd>
          <p className="text-[13.5px] font-medium text-ink-900">ABC 마케팅 인턴</p>
          <p className="text-[12px] text-gray-400">2024.06 - 2024.08</p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {INTERN_TASKS.map((task) => (
              <li key={task} className="flex gap-1.5 text-[12.5px] text-gray-500">
                <span>·</span>
                {task}
              </li>
            ))}
          </ul>
        </DetailCard>

        <DetailCard icon={Trophy} title="수상" onAdd>
          <p className="text-[13.5px] font-medium text-ink-900">마케팅 아이디어 공모전 장려상</p>
          <p className="text-[12px] text-gray-400">2024.06</p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {AWARD_DETAILS.map((detail) => (
              <li key={detail} className="flex gap-1.5 text-[12.5px] text-gray-500">
                <span>·</span>
                {detail}
              </li>
            ))}
          </ul>
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
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-gray-500">
              <span>총 등록 18개</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                최근 업데이트 2024.06.18
              </span>
              <span>이전 등록 항목 2개</span>
              <span>첫 등록일 2023.03.15</span>
            </div>
          </div>
        </div>
        <button className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-ink-900 shadow-sm hover:bg-gray-100">
          성장 기록 보기
        </button>
      </div>
    </MyPageLayout>
  )
}
