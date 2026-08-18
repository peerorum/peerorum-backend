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

    // index.css reserves the scrollbar gutter permanently
    // (`scrollbar-gutter: stable` on :root), so hiding the scrollbar here
    // never changes the page's width — no extra compensation needed.
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
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
