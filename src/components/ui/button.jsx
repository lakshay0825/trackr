import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 hover:shadow-md',
        secondary:
          'border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50 hover:border-zinc-300',
        ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        destructive:
          'border border-transparent bg-red-50 text-red-700 hover:bg-red-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-xl px-6',
        icon: 'size-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default'
      size: 'default',
    },
  },
)

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
