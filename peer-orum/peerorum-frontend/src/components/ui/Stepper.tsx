import { Check } from 'lucide-react'

export interface StepperItem {
  label: string
}

export default function Stepper({
  steps,
  currentIndex,
}: {
  steps: StepperItem[]
  currentIndex: number
}) {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${
                  isDone
                    ? 'bg-blue-600 text-white'
                    : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={`whitespace-nowrap text-[12.5px] font-medium ${
                  isCurrent ? 'text-ink-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-3 mb-6 h-[2px] w-10 sm:w-16 ${
                  isDone ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
