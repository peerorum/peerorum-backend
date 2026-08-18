const MEDAL_STYLES: Record<number, string> = {
  1: 'bg-amber-100 text-amber-600',
  2: 'bg-gray-200 text-gray-500',
  3: 'bg-orange-100 text-orange-600',
}

export default function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="flex h-7 w-7 items-center justify-center text-[13px] font-semibold text-gray-400">
        {rank}
      </span>
    )
  }

  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${MEDAL_STYLES[rank]}`}
    >
      {rank}
    </span>
  )
}
