import type { ComponentType } from 'react'

export default function StatTile({
  icon: Icon,
  iconClassName = 'bg-blue-50 text-blue-600',
  label,
  value,
  delta,
}: {
  icon: ComponentType<{ className?: string }>
  iconClassName?: string
  label: string
  value: string
  delta?: { direction: 'up' | 'down'; text: string }
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-gray-500">{label}</p>
          <p className="mt-1.5 text-[22px] font-bold text-ink-900">{value}</p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {delta && (
        <p
          className={`mt-2 text-[12px] font-medium ${
            delta.direction === 'up' ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {delta.direction === 'up' ? '▲' : '▼'} {delta.text}
        </p>
      )}
    </div>
  )
}
