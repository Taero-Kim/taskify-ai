import type { ReactNode } from 'react'

import { AuthProvider } from '@/features/auth/contexts/authProvider'
import { ModalProvider } from '@/shared/components/modal'
import { ToastProvider } from '@/shared/components/toast'

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>{children}</ModalProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
