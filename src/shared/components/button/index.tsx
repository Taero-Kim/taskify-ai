import type { VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { buttonVariants } from '@/shared/components/button/buttonVariants'
import { cn } from '@/shared/utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, type = 'button', variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ size, variant }), className)}
        ref={ref}
        type={type}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
