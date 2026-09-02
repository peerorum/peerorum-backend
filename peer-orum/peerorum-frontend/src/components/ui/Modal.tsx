import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  onClose,
  children,
  maxWidthClassName = 'max-w-[440px]',
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxWidthClassName?: string
}) {
  useEffect(() => {
    if (!open) return

    // Hiding the scrollbar here would otherwise widen the page by the
    // scrollbar's own width, causing a visible layout shift. Measure it
    // and compensate with padding so the page underneath never reflows.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  )
}
