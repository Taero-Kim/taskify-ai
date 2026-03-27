import { createContext, type ReactNode } from 'react'

type ModalTone = 'danger' | 'neutral' | 'primary'

export type ModalAction = {
  keepOpen?: boolean
  label: string
  onClick?: () => void
  tone?: ModalTone
}

export type ModalOptions = {
  actions?: ModalAction[]
  content?: ReactNode
  description?: string
  dismissOnBackdrop?: boolean
  title: string
}

export type ModalContextValue = {
  closeAllModals: () => void
  closeModal: (modalId?: string) => void
  openModal: (options: ModalOptions) => string
}

export const ModalContext = createContext<ModalContextValue | null>(null)
