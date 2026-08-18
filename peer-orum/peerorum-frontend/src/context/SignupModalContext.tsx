import { createContext, useContext, useState, type ReactNode } from 'react'

export type SignupModalStep = 'intro' | 'basic'

interface SignupModalContextValue {
  isOpen: boolean
  initialStep: SignupModalStep
  open: (step?: SignupModalStep) => void
  close: () => void
}

const SignupModalContext = createContext<SignupModalContextValue | null>(null)

export function SignupModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialStep, setInitialStep] = useState<SignupModalStep>('intro')

  return (
    <SignupModalContext.Provider
      value={{
        isOpen,
        initialStep,
        open: (step = 'intro') => {
          setInitialStep(step)
          setIsOpen(true)
        },
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SignupModalContext.Provider>
  )
}

export function useSignupModal() {
  const ctx = useContext(SignupModalContext)
  if (!ctx) throw new Error('useSignupModal must be used within SignupModalProvider')
  return ctx
}
