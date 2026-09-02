import { useNavigate } from 'react-router-dom'
import { BarChart3, Compass, Lightbulb, Lock, TrendingUp } from 'lucide-react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import PenguinHero from '../../components/ui/PenguinHero'
import Stepper from '../../components/ui/Stepper'
import { useAuth } from '../../context/AuthContext'

const BENEFITS = [
  { icon: BarChart3, title: '조건별 익명 스펙 비교', description: '학교, 학과, 학년 등 다양한 조건으로 비교할 수 있어요.' },
  { icon: Compass, title: '나의 위치 확인', description: '상위 몇 %에 위치하는지 정확히 확인할 수 있어요.' },
  { icon: TrendingUp, title: '강점과 보완점 분석', description: '나의 강점과 보완점을 항목별로 확인할 수 있어요.' },
  { icon: Lightbulb, title: 'AI 맞춤 인사이트', description: 'AI 분석을 통해 맞춤 스펙 관리를 도와드려요.' },
]

export default function CompareRequireSpecPage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const handleRegisterClick = () => {
    navigate(isLoggedIn ? '/mypage/specs' : '/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-ink-900">스펙 비교</h1>
            <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-gray-500">
              비교할 조건을 선택하고 익명 스펙을 확인해보세요. 같은 조건의 학생들이 어디까지
              왔는지 확인하고, 나의 위치를 파악해보세요.
            </p>
          </div>
          <Stepper
            steps={[{ label: '조건 선택' }, { label: '스펙 비교' }, { label: '나의 위치' }]}
            currentIndex={0}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm shadow-black/[0.02]">
          <div className="mx-auto flex h-28 w-28 items-center justify-center">
            <PenguinHero className="h-28 w-28" />
          </div>

          <h2 className="mx-auto mt-6 max-w-lg text-[20px] font-bold leading-snug text-ink-900">
            스펙을 1개 이상 등록해야 익명 스펙을 열람하고 비교할 수 있어요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-gray-500">
            나의 스펙을 등록하면 같은 조건의 학생들과 비교하고 내 위치와 강점을 정확히
            파악해보세요.
          </p>

          <div className="mx-auto mt-5 flex max-w-md items-start gap-2 rounded-xl bg-blue-50 p-3.5 text-left">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <p className="text-[12.5px] leading-relaxed text-blue-700">
              등록하신 정보는 익명으로 보호되며, 다른 사용자에게 내 개인 정보는 공개되지 않습니다.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRegisterClick}
              className="rounded-xl bg-blue-600 px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              내 스펙 등록하기
            </button>
          </div>
        </div>

        <h3 className="mb-4 mt-10 text-center text-[16px] font-bold text-ink-900">
          스펙을 등록하면 이런 정보를 확인할 수 있어요!
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <benefit.icon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-3 text-[13.5px] font-bold text-ink-900">{benefit.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-2xl bg-gray-50 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[13.5px] font-semibold text-ink-900">아직 스펙 등록이 어렵다면?</p>
            <p className="text-[12.5px] text-gray-500">
              서비스 소개를 통해 Peer Oreum을 더 자세히 알아보세요.
            </p>
          </div>
          <a
            href="/#service-intro"
            className="shrink-0 text-[13px] font-semibold text-blue-600 hover:underline"
          >
            서비스 소개 보러가기 →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
