import { ChevronDown, ChevronLeft, ChevronRight, Download, MessageCircle, Plus, RefreshCw, Search, UserCheck, UserCog, UserX, Users } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import StatTile from '../../components/admin/StatTile'
import { ADMIN_USERS } from '../../data/mockAdmin'

const FILTERS = ['전체 학교', '전체 학년', '전체 상태']

const STATUS_STYLE: Record<string, string> = {
  활성: 'bg-emerald-50 text-emerald-600',
  휴면: 'bg-orange-50 text-orange-600',
  정지: 'bg-rose-50 text-rose-600',
}

const VERIFIED_STYLE: Record<string, string> = {
  인증완료: 'bg-blue-50 text-blue-600',
  인증대기: 'bg-gray-100 text-gray-500',
}

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[22px] font-bold text-ink-900">사용자 목록</h1>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 아이디, 학교, 이메일로 검색하세요."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-[13.5px] outline-none placeholder:text-gray-400 focus:border-blue-500"
          />
        </div>
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] font-medium text-ink-900 hover:bg-gray-50"
          >
            {filter}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
        ))}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          필터 초기화
        </button>
        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-3.5 w-3.5" />
          사용자 추가
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Users} iconClassName="bg-blue-50 text-blue-600" label="전체 사용자" value="2,543명" />
        <StatTile
          icon={UserCheck}
          iconClassName="bg-emerald-50 text-emerald-600"
          label="활성 사용자"
          value="2,102명"
        />
        <StatTile icon={UserCog} iconClassName="bg-orange-50 text-orange-600" label="휴면 계정" value="312명" />
        <StatTile icon={UserX} iconClassName="bg-rose-50 text-rose-600" label="정지 계정" value="129명" />
      </div>

      <div className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm shadow-black/[0.02]">
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[13.5px] font-semibold text-ink-900">총 2,543명</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              내보내기
            </button>
            <button
              type="button"
              aria-label="새로고침"
              className="flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-y border-gray-100 text-gray-400">
                <th className="px-5 py-3 font-medium">이름</th>
                <th className="px-3 py-3 font-medium">아이디</th>
                <th className="px-3 py-3 font-medium">학교</th>
                <th className="px-3 py-3 font-medium">전공</th>
                <th className="px-3 py-3 font-medium">학년</th>
                <th className="px-3 py-3 font-medium">가입일</th>
                <th className="px-3 py-3 font-medium">상태</th>
                <th className="px-3 py-3 font-medium">인증 여부</th>
                <th className="px-3 py-3 text-right font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_USERS.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2.5 font-semibold text-ink-900">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                        {row.name.slice(0, 1)}
                      </span>
                      {row.name}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-gray-500">{row.id}</td>
                  <td className="px-3 py-3.5 text-gray-500">{row.school}</td>
                  <td className="px-3 py-3.5 text-gray-500">{row.major}</td>
                  <td className="px-3 py-3.5 text-gray-500">{row.grade}</td>
                  <td className="px-3 py-3.5 text-gray-500">{row.joinedAt}</td>
                  <td className="px-3 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${STATUS_STYLE[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${VERIFIED_STYLE[row.verified]}`}
                    >
                      {row.verified}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-ink-900 hover:bg-gray-50"
                      >
                        상세 보기
                      </button>
                      <button
                        type="button"
                        aria-label="메시지"
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-[12.5px] text-gray-400">1-10 / 2,543명</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="이전"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12.5px] font-medium ${
                  page === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-gray-400">…</span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[12.5px] font-medium text-gray-500 hover:bg-gray-50"
            >
              255
            </button>
            <button
              type="button"
              aria-label="다음"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
