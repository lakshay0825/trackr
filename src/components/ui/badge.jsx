import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-zinc-900 text-white hover:bg-zinc-800',
        outline: 'border-zinc-200 bg-white text-zinc-700 shadow-sm',
        applied:
          'border-blue-500/25 bg-blue-500/10 text-blue-800 ring-1 ring-inset ring-blue-500/15',
        interview:
          'border-amber-500/25 bg-amber-500/10 text-amber-900 ring-1 ring-inset ring-amber-500/15',
        offer:
          'border-emerald-500/25 bg-emerald-500/10 text-emerald-900 ring-1 ring-inset ring-emerald-500/15',
        rejected:
          'border-red-500/25 bg-red-500/10 text-red-800 ring-1 ring-inset ring-red-500/15',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
