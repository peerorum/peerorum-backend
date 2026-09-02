import { GraduationCap, Globe2, Award, Briefcase } from 'lucide-react'
import Logo from '../ui/Logo'

const STATS = [
  {
    icon: GraduationCap,
    label: '학점',
    value: '4.12 / 4.5',
    percentile: '상위 23%',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Globe2,
    label: '어학',
    value: 'OPIc IH',
    percentile: '상위 31%',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Award,
    label: '자격증',
    value: '3개',
    percentile: '상위 28%',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    icon: Briefcase,
    label: '활동',
    value: '5개',
    percentile: '상위 41%',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
]

export default function PhoneMockup() {
  return (
    <div className="w-[260px] rounded-[2.5rem] border-[6px] border-ink-900 bg-white shadow-2xl overflow-hidden shrink-0">
      <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-ink-900">
        <span>9:41</span>
        <span className="tracking-widest">●●●</span>
      </div>

      <div className="flex items-center px-4 py-3">
        <Logo className="h-4" />
      </div>

      <div className="mx-3 mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink-900">나의 스펙 요약</span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
            상위 23%
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
                </div>
                <span className="text-[12px] text-gray-500">{stat.label}</span>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-ink-900">{stat.value}</div>
                <div className="text-[10px] text-gray-400">{stat.percentile}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
