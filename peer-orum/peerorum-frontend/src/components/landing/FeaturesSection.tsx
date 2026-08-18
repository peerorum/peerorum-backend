import { ShieldCheck, BarChart3, MessageCircle } from 'lucide-react'

const FEATURES = [
  {
    icon: ShieldCheck,
    title: '인증된 스펙 데이터',
    description: '증빙자료를 기반으로 검증된\n신뢰도 높은 데이터를 제공해요.',
  },
  {
    icon: BarChart3,
    title: '동일 집단 비교',
    description: '학교, 학과, 학년, 직무 등\n다양한 조건으로 비교할 수 있어요.',
  },
  {
    icon: MessageCircle,
    title: '익명 기반 서비스',
    description: '익명으로 자유롭게 이용하고\n안전하게 비교할 수 있어요.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-[28px] font-bold text-ink-900">
          피어오름이 특별한 이유
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm shadow-black/[0.02]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-[17px] font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
