import { ShieldCheck } from 'lucide-react'
import howtoSignup from '../../assets/images/howto-signup.png'
import howtoRegister from '../../assets/images/howto-register.png'
import howtoCondition from '../../assets/images/howto-condition.png'
import howtoCompare from '../../assets/images/howto-compare.png'

const STEPS = [
  {
    number: '01',
    icon: howtoSignup,
    title: '회원가입 및 인증',
    description: '학교 인증을 통해 안전하게 가입합니다.',
  },
  {
    number: '02',
    icon: howtoRegister,
    title: '내 스펙 등록',
    description: '학점, 어학, 자격증 등 스펙 정보를 등록하고 관리합니다.',
  },
  {
    number: '03',
    icon: howtoCondition,
    title: '비교 조건 설정',
    description: '학교, 학과, 학년, 직무 등 원하는 조건을 선택합니다.',
  },
  {
    number: '04',
    icon: howtoCompare,
    title: '익명 스펙 비교',
    description: '같은 조건의 학생들과 익명으로 스펙을 비교하세요.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-ink-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="text-[14px] font-semibold text-blue-400">How to use</span>
          <h2 className="mt-3 text-[28px] font-bold leading-snug text-white">
            피어오름 이용 방법
            <br />
            단 4단계로 시작하세요.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <span className="text-[14px] font-bold text-blue-400">{step.number}</span>
              <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-850 border border-ink-700">
                <img src={step.icon} alt="" width={190} height={190} className="h-10 w-10 object-contain" />
              </div>
              <h3 className="mt-5 text-[16px] font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center gap-3 rounded-2xl bg-ink-850 border border-ink-700 px-6 py-5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-400" />
          <p className="text-[13.5px] text-gray-300">
            <span className="font-semibold text-white">안전한 익명 시스템</span>
            {'  '}모든 정보는 익명으로 처리되며, 서로의 개인정보는 절대 노출되지 않습니다.
          </p>
        </div>
      </div>
    </section>
  )
}
