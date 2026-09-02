import Modal from '../ui/Modal'
import type { LegalTerm } from '../../data/legalTerms'

export default function LegalTermsModal({
  term,
  onClose,
}: {
  term: LegalTerm | null
  onClose: () => void
}) {
  return (
    <Modal open={term !== null} onClose={onClose} maxWidthClassName="max-w-xl">
      {term && (
        <div>
          <h2 className="text-[19px] font-bold text-ink-900">{term.title}</h2>
          <div className="mt-4 max-h-[60vh] overflow-y-auto whitespace-pre-line rounded-xl bg-gray-50 p-4 text-[13px] leading-relaxed text-gray-600">
            {term.body}
          </div>
        </div>
      )}
    </Modal>
  )
}
