import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import {
  ModalContext,
  type ModalContextValue,
  type ModalOptions,
} from '@/shared/components/modal/modalContext'

type ModalItem = ModalOptions & {
  id: string
}

type ModalTone = 'danger' | 'neutral' | 'primary'

const actionToneClassNameMap: Record<ModalTone, string> = {
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  neutral: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  primary: 'bg-taskify-primary-600 text-white hover:bg-taskify-primary-500',
}

const createModalId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `modal-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalItem[]>([])

  const closeModal = useCallback((modalId?: string) => {
    setModals((prevModals) => {
      if (!modalId) {
        return prevModals.slice(0, -1)
      }

      return prevModals.filter((modal) => modal.id !== modalId)
    })
  }, [])

  const closeAllModals = useCallback(() => {
    setModals([])
  }, [])

  const openModal = useCallback((options: ModalOptions) => {
    const modalId = createModalId()

    setModals((prevModals) => [...prevModals, { ...options, id: modalId }])

    return modalId
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.body.style.overflow = modals.length > 0 ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [modals.length])

  useEffect(() => {
    const handleEscapeKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      closeModal()
    }

    window.addEventListener('keydown', handleEscapeKeydown)

    return () => {
      window.removeEventListener('keydown', handleEscapeKeydown)
    }
  }, [closeModal])

  const value = useMemo<ModalContextValue>(
    () => ({
      closeAllModals,
      closeModal,
      openModal,
    }),
    [closeAllModals, closeModal, openModal],
  )

  const topModal = modals.at(-1)

  return (
    <ModalContext.Provider value={value}>
      {children}
      {topModal && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-6 py-10">
              <button
                aria-label="모달 닫기"
                className="absolute inset-0 cursor-default"
                onClick={() => {
                  if (topModal.dismissOnBackdrop === false) {
                    return
                  }

                  closeModal(topModal.id)
                }}
                type="button"
              />
              <div className="relative z-10 flex w-full max-w-lg flex-col gap-6 rounded-3xl bg-white p-8 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">{topModal.title}</h2>
                    {topModal.description ? (
                      <p className="text-sm leading-6 text-slate-600">{topModal.description}</p>
                    ) : null}
                  </div>
                  <button
                    className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200"
                    onClick={() => closeModal(topModal.id)}
                    type="button"
                  >
                    닫기
                  </button>
                </div>
                {topModal.content ? <div>{topModal.content}</div> : null}
                {topModal.actions?.length ? (
                  <div className="flex flex-wrap justify-end gap-3">
                    {topModal.actions.map((action) => (
                      <button
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${actionToneClassNameMap[action.tone ?? 'neutral']}`}
                        key={action.label}
                        onClick={() => {
                          action.onClick?.()

                          if (!action.keepOpen) {
                            closeModal(topModal.id)
                          }
                        }}
                        type="button"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </ModalContext.Provider>
  )
}
