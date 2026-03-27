import { createContext } from 'react'

type ToastTone = 'error' | 'info' | 'success'

export type ToastOptions = {
  description?: string
  duration?: number
  title: string
  tone?: ToastTone
}

export type ToastContextValue = {
  closeAllToasts: () => void
  closeToast: (toastId: string) => void
  openToast: (options: ToastOptions) => string
}

export const ToastContext = createContext<ToastContextValue | null>(null)
