import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import {
  ToastContext,
  type ToastContextValue,
  type ToastOptions,
} from '@/shared/components/toast/toastContext'

type ToastItem = {
  description?: string
  duration: number
  id: string
  title: string
  tone: 'error' | 'info' | 'success'
}

const DEFAULT_DURATION = 3200

const toneClassNameMap: Record<ToastItem['tone'], string> = {
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-slate-200 bg-white text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const createToastId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutMapRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const closeToast = useCallback((toastId: string) => {
    const timeoutId = timeoutMapRef.current.get(toastId)

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutMapRef.current.delete(toastId)
    }

    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }, [])

  const closeAllToasts = useCallback(() => {
    timeoutMapRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    timeoutMapRef.current.clear()
    setToasts([])
  }, [])

  const openToast = useCallback(
    ({ description, duration = DEFAULT_DURATION, title, tone = 'info' }: ToastOptions) => {
      const toastId = createToastId()
      const nextToast: ToastItem = {
        description,
        duration,
        id: toastId,
        title,
        tone,
      }

      setToasts((prevToasts) => [...prevToasts, nextToast])

      const timeoutId = setTimeout(() => {
        closeToast(toastId)
      }, duration)

      timeoutMapRef.current.set(toastId, timeoutId)

      return toastId
    },
    [closeToast],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      closeAllToasts,
      closeToast,
      openToast,
    }),
    [closeAllToasts, closeToast, openToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-full max-w-sm flex-col gap-3 px-4">
              {toasts.map((toast) => (
                <div
                  className={`pointer-events-auto rounded-2xl border p-4 shadow-lg ${toneClassNameMap[toast.tone]}`}
                  key={toast.id}
                  role="status"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 flex-col gap-1">
                      <strong className="text-sm font-semibold">{toast.title}</strong>
                      {toast.description ? (
                        <p className="text-sm leading-6 opacity-90">{toast.description}</p>
                      ) : null}
                    </div>
                    <button
                      className="rounded-full px-2 py-1 text-xs font-semibold text-current/70 transition hover:text-current"
                      onClick={() => closeToast(toast.id)}
                      type="button"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}
