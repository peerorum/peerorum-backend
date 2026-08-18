import { useState } from 'react'
import { ArrowRight, ChevronUp, Heart, Lock } from 'lucide-react'
import FeedbackModal from './FeedbackModal'

const TABS = ['전체', '개선 예정', '개선 중', '완료']

const FEEDBACKS = [
  {
    votes: 128,
    title: '학교/학과 필터 세분화',
    description: '더 정확한 비교를 위해 필터를 세분화했어요.',
    status: '개선 완료',
    statusClass: 'bg-emerald-50 text-emerald-600',
  },
  {
    votes: 96,
    title: '스펙 항목 직접 추가 기능',
    description: '원하는 스펙 항목을 직접 추가할 수 있어요.',
    status: '개선 중',
    statusClass: 'bg-amber-50 text-amber-600',
  },
  {
    votes: 74,
    title: '모바일 UI/UX 개선',
    description: '더 편리한 모바일 환경을 위해 개선해요.',
    status: '개선 예정',
    statusClass: 'bg-blue-50 text-blue-600',
  },
]

export default function FeedbackSection() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <section className="bg-gray-50 px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
        <div>
          <span className="text-[14px] font-semibold text-blue-600">고객지원 · 피드백</span>
          <h2 className="mt-3 text-[30px] font-bold leading-snug text-ink-900">
            당신의 <span className="text-blue-600">의견</span>이
            <br />
            피어오름을 만듭니다.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-500">
            사용자의 피드백을 바탕으로
            <br />더 좋은 서비스를 만들어가고 있어요.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
            >
              피드백 남기기
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#"
              className="rounded-full border border-gray-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-gray-100"
            >
              개선 현황 보기
            </a>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-[13px] text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            모든 피드백은 익명으로 안전하게 관리됩니다.
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-black/[0.03]">
            <div className="mb-4 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>

            <h3 className="text-[16px] font-bold text-ink-900">피드백 보드</h3>
            <p className="mt-1 text-[13px] text-gray-400">
              여러분의 의견을 확인하고 서비스에 반영하고 있어요.
            </p>

            <div className="mt-4 flex gap-2">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ${
                    i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {FEEDBACKS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 p-3.5"
                >
                  <div className="flex w-9 shrink-0 flex-col items-center gap-0.5 rounded-lg bg-gray-50 py-1.5 text-gray-500">
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span className="text-[12px] font-bold">{item.votes}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-ink-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.statusClass}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-4 -top-6 hidden w-52 items-start gap-2 rounded-2xl bg-white p-3.5 shadow-xl md:flex">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Heart className="h-3.5 w-3.5 fill-current" />
            </span>
            <p className="text-[12px] font-medium leading-snug text-ink-900">
              여러분의 피드백이 피어오름의 성장을 만듭니다!
            </p>
          </div>
        </div>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </section>
  )
}
