interface Segment {
  label: string
  value: number
  percent: number
  strokeClass: string
  dotClass: string
}

const SIZE = 200
const STROKE_WIDTH = 26
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function GenderDonutChart({
  segments,
  total,
}: {
  segments: Segment[]
  total: number
}) {
  let cumulativePercent = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90" role="img" aria-label="사용자 성별 분포">
          {segments.map((segment) => {
            const dash = (segment.percent / 100) * CIRCUMFERENCE
            const offset = (cumulativePercent / 100) * CIRCUMFERENCE
            cumulativePercent += segment.percent
            return (
              <circle
                key={segment.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={-offset}
                className={segment.strokeClass}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[12px] text-gray-400">전체</span>
          <span className="text-[17px] font-bold text-ink-900">{total.toLocaleString()}명</span>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2.5 text-[13.5px]">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${segment.dotClass}`} />
            <span className="w-8 font-medium text-ink-900">{segment.label}</span>
            <span className="text-gray-500">
              {segment.percent}% ({segment.value.toLocaleString()}명)
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
