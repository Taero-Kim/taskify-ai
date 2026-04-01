import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
  errorMessage?: string
  label: string
  rightAdornment?: ReactNode
  wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, errorMessage, id, label, rightAdornment, wrapperClassName, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const isInvalid = Boolean(errorMessage)

    return (
      <div className={cn('flex flex-col gap-2', wrapperClassName)}>
        <label className="text-sm font-semibold text-slate-800" htmlFor={inputId}>
          {label}
        </label>
        <div className="relative">
          <input
            className={cn(
              'min-h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-taskify-primary-500 focus:ring-2 focus:ring-taskify-primary-100',
              rightAdornment ? 'pr-14' : undefined,
              isInvalid
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                : 'border-slate-200',
              className,
            )}
            id={inputId}
            ref={ref}
            {...props}
          />
          {rightAdornment ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightAdornment}
            </div>
          ) : null}
        </div>
        {errorMessage ? <p className="text-sm font-medium text-rose-500">{errorMessage}</p> : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
