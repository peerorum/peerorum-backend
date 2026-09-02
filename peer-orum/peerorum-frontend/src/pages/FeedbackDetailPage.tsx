import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronUp } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { FEEDBACKS, FEEDBACK_STATUS_STYLE } from '../data/mockFeedback'

export default function FeedbackDetailPage() {
  const { id } = useParams<{ id: string }>()
  const item = FEEDBACKS.find((f) => f.id === Number(id))
  const [upvoted, setUpvoted] = useState(false)

  if (!item) return <Navigate to="/feedback" replace />

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link
          to="/feedback"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-gray-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          피드백 보드로 돌아가기
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-xl sm:p-10">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => setUpvoted((v) => !v)}
              className={`flex w-14 shrink-0 flex-col items-center gap-0.5 rounded-xl border py-2.5 transition-colors ${
                upvoted
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ChevronUp className="h-5 w-5" />
              <span className="text-[13.5px] font-bold">{item.votes + (upvoted ? 1 : 0)}</span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${FEEDBACK_STATUS_STYLE[item.status]}`}
                >
                  {item.status}
                </span>
                <span className="text-[12.5px] text-gray-400">{item.createdAt}</span>
              </div>
              <h1 className="mt-2 text-[21px] font-bold leading-snug text-ink-900">{item.title}</h1>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-500">{item.description}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">
            <p className="text-[13.5px] font-semibold text-ink-900">상세 내용</p>
            <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-gray-600">
              {item.content}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
