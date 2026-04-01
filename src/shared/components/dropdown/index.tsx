import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

type DropdownProps = {
  align?: 'end' | 'start'
  children: ReactNode
  className?: string
  content: ReactNode
}

export const Dropdown = ({ align = 'end', children, className, content }: DropdownProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscapeKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscapeKeydown)

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscapeKeydown)
    }
  }, [])

  return (
    <div className={cn('relative', className)} ref={rootRef}>
      <div onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}>{children}</div>
      {isOpen ? (
        <div
          className={cn(
            'absolute top-[calc(100%+0.75rem)] z-20 min-w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {content}
        </div>
      ) : null}
    </div>
  )
}
