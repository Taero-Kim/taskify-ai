import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taskify-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
    variants: {
      size: {
        md: 'min-h-12 px-5 text-sm',
        sm: 'min-h-10 px-4 text-sm',
        lg: 'min-h-14 px-6 text-base',
      },
      variant: {
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
        outline: 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300',
        primary: 'bg-taskify-primary-600 text-white hover:bg-taskify-primary-500',
      },
    },
  },
)
