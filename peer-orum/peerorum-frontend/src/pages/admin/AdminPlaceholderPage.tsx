import { Construction } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'

export default function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <AdminLayout>
      <h1 className="text-[22px] font-bold text-ink-900">{title}</h1>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center">
        <Construction className="h-8 w-8 text-gray-300" />
        <p className="text-[14px] font-semibold text-ink-900">준비 중인 화면입니다</p>
        <p className="text-[13px] text-gray-400">{title} 화면은 곧 추가될 예정이에요.</p>
      </div>
    </AdminLayout>
  )
}
