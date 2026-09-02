import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  Briefcase,
  Building2,
  FileEdit,
  FileText,
  GraduationCap,
  Globe2,
  Target,
  Trophy,
  Users,
} from 'lucide-react'
import MyPageLayout from '../../layouts/MyPageLayout'
import PenguinMascot from '../../components/ui/PenguinMascot'
import PenguinHero from '../../components/ui/PenguinHero'
import RankPagination from '../../components/compare/RankPagination'
import { useAuth } from '../../context/AuthContext'

const PROFILE_FIELDS = [
  { icon: Building2, label: '학교', value: '단국대학교' },
  { icon: FileText, label: '학과', value: '경영학과' },
  { icon: GraduationCap, label: '학년', value: '4학년' },
  { icon: Target, label: '희망 직무', value: '마케팅' },
  { icon: Award, label: '전공 학점', value: '4.35 / 4.5' },
  { icon: Award, label: '평균 학점', value: '4.29 / 4.5' },
]

const REGISTERABLE_ITEMS = [
  { icon: GraduationCap, label: '학점', description: '재학중이거나 1학년일 경우 학점을 등록해요.' },
  { icon: Globe2, label: '어학', description: 'TOEIC, TOEFL, OPIc 등 어학 성적을 등록해요.' },
  { icon: Award, label: '자격증', description: '취득한 자격증과 유효기간을 등록해요.' },
  { icon: Briefcase, label: '대외활동', description: '대외활동 및 봉사활동을 등록해요.' },
  { icon: Users, label: '인턴', description: '인턴 경험을 등록해요.' },
  { icon: Trophy, label: '수상', description: '수상 내역과 성과를 등록해요.' },
]

const SUMMARY_STATS = [
  { icon: Globe2, label: '어학', value: 'TOEIC 780' },
  { icon: Award, label: '자격증', value: '4개' },
  { icon: Briefcase, label: '대외활동', value: '3회' },
  { icon: Users, label: '인턴', value: '1회' },
  { icon: Trophy, label: '수상', value: '1회' },
]

const CERTS = [
  { name: 'ADsP', date: '2024.05.10' },
  { name: '컴퓨터활용능력 2급', date: '2023.09.15' },
  { name: 'SQLD', date: '2024.01.20' },
  { name: '무역영어 1급', date: '2023.12.05' },
  { name: 'GTQ 1급', date: '2023.06.20' },
]
const CERTS_PAGE_SIZE = 6

const ACTIVITIES = [
  { name: '교내 마케팅 서포터즈 3기', period: '2024.03 - 2024.11' },
  { name: '한국경제 대학생 기자단 21기', period: '2023.09 - 2024.02' },
  { name: '대학 연합 마케팅 컨퍼런스 운영진', period: '2023.05 - 2023.11' },
]
const ACTIVITIES_PAGE_SIZE = 4

const INTERNSHIPS = [
  {
    company: 'ABC 마케팅 인턴',
    period: '2024.06 - 2024.08',
    tasks: ['SNS 콘텐츠 기획 및 운영', '시장 조사 및 경쟁사 분석', '프로모션 성과 분석 및 리포트 제작'],
  },
  {
    company: 'XYZ 브랜드전략팀 인턴',
    period: '2023.12 - 2024.02',
    tasks: ['시장 트렌드 리서치', 'SNS 채널 운영 지원', '브랜드 캠페인 기획 보조'],
  },
]

const AWARDS = [
  {
    title: '마케팅 아이디어 공모전 장려상',
    date: '2024.06',
    details: ['주최: 한국마케팅협회', '수상작: 대학생 잠재고객 브랜드 캠페인 제안'],
  },
  {
    title: '대학생 브랜드 마케팅 챌린지 우수상',
    date: '2023.11',
    details: ['주최: 대한마케팅학회', '수상작: SNS 바이럴 캠페인 기획안'],
  },
]

function DetailCard({
  icon: Icon,
  title,
  pagination,
  children,
}: {
  icon: typeof GraduationCap
  title: string
  pagination?: React.ReactNode
  children: React.ReactNode
}) {
  const header = (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-[14.5px] font-bold text-ink-900">{title}</h3>
    </div>
  )

  if (!pagination) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
        {header}
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-72 flex-col rounded-2xl border border-gray-100 bg-white p-5 pb-3 shadow-sm shadow-black/[0.02]">
      {header}
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      {pagination}
    </div>
  )
}

function CertsCard() {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(CERTS.length / CERTS_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const items = CERTS.slice((currentPage - 1) * CERTS_PAGE_SIZE, currentPage * CERTS_PAGE_SIZE)

  return (
    <DetailCard
      icon={Award}
      title="자격증"
      pagination={
        <RankPagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
      }
    >
      <ul className="flex flex-col gap-2.5">
        {items.map((cert) => (
          <li key={cert.name} className="flex items-center justify-between text-[13.5px]">
            <span className="font-medium text-ink-900">{cert.name}</span>
            <span className="text-gray-400">{cert.date}</span>
          </li>
        ))}
      </ul>
    </DetailCard>
  )
}

function ActivitiesCard() {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(ACTIVITIES.length / ACTIVITIES_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const items = ACTIVITIES.slice(
    (currentPage - 1) * ACTIVITIES_PAGE_SIZE,
    currentPage * ACTIVITIES_PAGE_SIZE,
  )

  return (
    <DetailCard
      icon={Briefcase}
      title="대외활동"
      pagination={
        <RankPagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
      }
    >
      <ul className="flex flex-col gap-2.5">
        {items.map((activity) => (
          <li key={activity.name} className="text-[13.5px]">
            <p className="font-medium text-ink-900">{activity.name}</p>
            <p className="text-[12px] text-gray-400">{activity.period}</p>
          </li>
        ))}
      </ul>
    </DetailCard>
  )
}

function InternshipsCard() {
  const [page, setPage] = useState(1)
  const totalPages = INTERNSHIPS.length
  const currentPage = Math.min(page, totalPages)
  const intern = INTERNSHIPS[currentPage - 1]

  return (
    <DetailCard
      icon={Users}
      title="인턴 경험"
      pagination={
        <RankPagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
      }
    >
      <p className="text-[13.5px] font-medium text-ink-900">{intern.company}</p>
      <p className="text-[12px] text-gray-400">{intern.period}</p>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {intern.tasks.map((task) => (
          <li key={task} className="flex gap-1.5 text-[12.5px] text-gray-500">
            <span>·</span>
            {task}
          </li>
        ))}
      </ul>
    </DetailCard>
  )
}

function AwardsCard() {
  const [page, setPage] = useState(1)
  const totalPages = AWARDS.length
  const currentPage = Math.min(page, totalPages)
  const award = AWARDS[currentPage - 1]

  return (
    <DetailCard
      icon={Trophy}
      title="수상"
      pagination={
        <RankPagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
      }
    >
      <p className="text-[13.5px] font-medium text-ink-900">{award.title}</p>
      <p className="text-[12px] text-gray-400">{award.date}</p>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {award.details.map((detail) => (
          <li key={detail} className="flex gap-1.5 text-[12.5px] text-gray-500">
            <span>·</span>
            {detail}
          </li>
        ))}
      </ul>
    </DetailCard>
  )
}

export default function MySpecsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user?.hasSpec) {
    return (
      <MyPageLayout>
        <div>
          <h1 className="text-[22px] font-bold text-ink-900">내 스펙</h1>
          <p className="mt-1 text-[13.5px] text-gray-500">
            등록한 스펙을 관리하고, 성장 과정을 한눈에 확인해보세요.
          </p>
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
            <span className="text-[16px] font-bold text-ink-900">유경</span>
            <p className="mt-0.5 text-[13px] text-gray-500">
              단국대학교 경영학과 4학년 · 마케팅 희망
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3 lg:grid-cols-6">
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

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3 lg:grid-cols-5">
          {SUMMARY_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                <stat.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11.5px] text-gray-400">{stat.label}</p>
                <p className="text-[13px] font-bold text-ink-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-[16px] font-bold text-ink-900">상세 스펙</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard icon={GraduationCap} title="학업">
          <div>
            <span className="text-[20px] font-bold text-ink-900">4.29 / 4.5</span>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[95%] rounded-full bg-blue-600" />
            </div>
            <p className="mt-1.5 text-[11.5px] text-gray-400">전공 평균 3.65 / 4.5</p>
          </div>
        </DetailCard>

        <DetailCard icon={Globe2} title="어학">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[13px] font-medium text-gray-500">TOEIC</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-ink-900">780</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[78%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
            <div>
              <span className="text-[13px] font-medium text-gray-500">OPIc</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-ink-900">IH</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[72%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </DetailCard>

        <CertsCard />
        <ActivitiesCard />
        <InternshipsCard />
        <AwardsCard />
      </div>
    </MyPageLayout>
  )
}
