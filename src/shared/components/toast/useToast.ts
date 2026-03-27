import { useContext } from 'react'

import { ToastContext } from '@/shared/components/toast/toastContext'

export const useToast = () => {
  const toastContext = useContext(ToastContext)

  if (!toastContext) {
    throw new Error('useToast must be used within ToastProvider.')
  }

  return toastContext
}
