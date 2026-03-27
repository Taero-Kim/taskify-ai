import { useContext } from 'react'

import { ModalContext } from '@/shared/components/modal/modalContext'

export const useModal = () => {
  const modalContext = useContext(ModalContext)

  if (!modalContext) {
    throw new Error('useModal must be used within ModalProvider.')
  }

  return modalContext
}
