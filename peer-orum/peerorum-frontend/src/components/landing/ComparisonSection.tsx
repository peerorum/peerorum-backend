import { Link } from 'react-router-dom'
import { ListFilter, User } from 'lucide-react'

const FILTERS = ['경영학과', '4학년', '마케팅 직무 희망']

const STUDENTS = [
  {
    id: '5231',
    label: '익명 01',
    gpa: '4.25',
    gpaPercentile: '상위 14%',
    lang: 'TOEIC 900',
    langPercentile: '상위 18%',
    certs: '3개',
    activities: '인턴 1회\n대외활동 3개',
    job: '마케팅',
  },
  {
    id: '8842',
    label: '익명 02',
    gpa: '3.85',
    gpaPercentile: '상위 32%',
    lang: 'OPIc IH',
    langPercentile: '상위 41%',
    certs: '2개',
    activities: '대외활동 4개\n공모전 2회',
    job: '마케팅',
  },
]

export default function ComparisonSection() {
  return (
    <section className="bg-blue-50/40 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-[26px] font-bold text-ink-900">
          같은 조건의 학생들은 어디까지 왔을까?
        </h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {FILTERS.map((filter) => (
            <span
              key={filter}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-600"
            >
              {filter}
            </span>
          ))}
          <button className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-[13px] font-semibold text-white">
            <ListFilter className="h-3.5 w-3.5" />
            조건 변경
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm shadow-black/[0.02]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[13px] text-gray-400">
                <th className="px-6 py-4 font-medium">학생</th>
                <th className="px-6 py-4 font-medium">학점</th>
                <th className="px-6 py-4 font-medium">어학</th>
                <th className="px-6 py-4 font-medium">자격증</th>
                <th className="px-6 py-4 font-medium">활동</th>
                <th className="px-6 py-4 font-medium">희망직무</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((student) => (
                <tr key={student.label} className="border-b border-gray-50 last:border-none">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <User className="h-4 w-4" />
                      </span>
                      <span className="text-[14px] font-medium text-ink-900">{student.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[14px] font-semibold text-ink-900">{student.gpa}</div>
                    <div className="text-[12px] text-blue-600">{student.gpaPercentile}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[14px] font-semibold text-ink-900">{student.lang}</div>
                    <div className="text-[12px] text-blue-600">{student.langPercentile}</div>
                  </td>
                  <td className="px-6 py-5 text-[14px] text-ink-900">{student.certs}</td>
                  <td className="whitespace-pre-line px-6 py-5 text-[13px] leading-snug text-ink-900">
                    {student.activities}
                  </td>
                  <td className="px-6 py-5 text-[14px] text-ink-900">{student.job}</td>
                  <td className="px-6 py-5">
                    <Link
                      to={`/compare/${student.id}`}
                      className="inline-block rounded-full border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50"
                    >
                      프로필 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
