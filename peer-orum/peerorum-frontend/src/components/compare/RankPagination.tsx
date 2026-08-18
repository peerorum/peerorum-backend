import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function RankPagination({ totalPages = 13 }: { totalPages?: number }) {
  const pages = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center justify-center gap-1.5 py-5">
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-medium ${
            page === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      <span className="px-1 text-[13px] text-gray-300">...</span>
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-100">
        {totalPages}
      </button>
      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
