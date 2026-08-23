import { useEffect, useState } from 'react'
import { ClipboardList, Flag, UserPlus, Users } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import StatTile from '../../components/admin/StatTile'
import SignupTrendChart from '../../components/admin/SignupTrendChart'
import GenderDonutChart from '../../components/admin/GenderDonutChart'
import PenguinHero from '../../components/ui/PenguinHero'
import { fetchAdminDashboard, type AdminDashboardData } from '../../api/admin'

const REPORT_STATUS_STYLE: Record<string, string> = {
  '처리 대기': 'bg-rose-50 text-rose-600',
  '처리 중': 'bg-blue-50 text-blue-600',
  '처리 완료': 'bg-emerald-50 text-emerald-600',
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const totalGender = data?.genderDistribution ? data.genderDistribution.reduce((sum, item) => sum + item.value, 0) : 0

  useEffect(() => {
    fetchAdminDashboard().then(setData).catch(console.error)
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-[22px] font-bold text-ink-900">대시보드</h1>

      <div className="mt-4 flex items-center justify-between gap-6 rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 px-8 py-6 text-white">
        <div>
          <p className="text-[18px] font-bold">안녕하세요, 관리자님! 👋</p>
          <p className="mt-1 text-[13.5px] text-white/80">피어오름 서비스 현황을 한눈에 확인하세요.</p>
        </div>
        <PenguinHero className="h-20 w-20 shrink-0" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Users}
          iconClassName="bg-blue-50 text-blue-600"
          label="전체 사용자"
          value={data ? `${data.totalUsers.toLocaleString()}명` : '...'}
          delta={{ direction: 'up', text: '전체' }}
        />
        <StatTile
          icon={UserPlus}
          iconClassName="bg-emerald-50 text-emerald-600"
          label="신규 가입자"
          value={data ? `${data.newSignups.toLocaleString()}명` : '...'}
          delta={{ direction: 'up', text: '금일 기준' }}
        />
        <StatTile
          icon={ClipboardList}
          iconClassName="bg-violet-50 text-violet-600"
          label="등록 스펙 카드"
          value={data ? `${data.totalSpecCards.toLocaleString()}건` : '...'}
          delta={{ direction: 'up', text: '전체' }}
        />
        <StatTile
          icon={Flag}
          iconClassName="bg-orange-50 text-orange-600"
          label="신고 처리 건수"
          value={data ? `${data.reportCount.toLocaleString()}건` : '...'}
          delta={{ direction: 'down', text: '처리 중' }}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.02]">
          <p className="text-[14.5px] font-bold text-ink-900">사용자 가입 추이</p>
          <div className="mt-4">
            {data?.signupTrend ? <SignupTrendChart data={data.signupTrend} /> : <div className="h-[300px] flex items-center justify-center text-gray-400">Loading...</div>}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.02]">
          <p className="text-[14.5px] font-bold text-ink-900">사용자 성별 분포</p>
          <div className="mt-6">
            {data?.genderDistribution ? (
              <GenderDonutChart 
                segments={data.genderDistribution.map(g => {
                  let strokeClass = 'stroke-gray-200'
                  let dotClass = 'bg-gray-200'
                  if (g.name === '남성') { strokeClass = 'stroke-blue-600'; dotClass = 'bg-blue-600' }
                  else if (g.name === '여성') { strokeClass = 'stroke-blue-400'; dotClass = 'bg-blue-400' }
                  
                  return {
                    label: g.name,
                    value: g.value,
                    percent: Math.round((g.value / totalGender) * 100),
                    strokeClass,
                    dotClass
                  }
                })} 
                total={totalGender} 
              />
            ) : <div className="h-[300px] flex items-center justify-center text-gray-400">Loading...</div>}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.02]">
          <div className="flex items-center justify-between">
            <p className="text-[14.5px] font-bold text-ink-900">최근 가입 사용자</p>
            <span className="text-[12.5px] font-medium text-blue-600 cursor-pointer hover:underline">전체 보기</span>
          </div>
          <ul className="mt-4 flex flex-col gap-3.5">
            {data?.recentSignups.map((signup) => (
              <li key={signup.handle} className="flex items-center justify-between text-[13.5px]">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[12px] font-bold text-gray-500">
                    {signup.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="font-semibold text-ink-900">{signup.name}</span>{' '}
                    <span className="text-gray-400">{signup.handle}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  {signup.time}
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                    일반
                  </span>
                </span>
              </li>
            ))}
            {!data && <li className="text-[13px] text-gray-400 py-2">로딩 중...</li>}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.02]">
          <div className="flex items-center justify-between">
            <p className="text-[14.5px] font-bold text-ink-900">최근 신고 내역</p>
            <span className="text-[12.5px] font-medium text-blue-600">전체 보기</span>
          </div>
          <ul className="mt-4 flex flex-col gap-3.5">
            {data?.recentReports?.map((report) => (
              <li
                key={report.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-ink-900">{report.type}</span>
                    <span className="text-[11px] text-gray-400">{report.id}</span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-gray-500">{report.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${REPORT_STATUS_STYLE[report.status]}`}
                  >
                    {report.status}
                  </span>
                  <span className="text-[11.5px] text-gray-400">{report.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
