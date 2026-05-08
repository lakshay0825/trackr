import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-2xl border border-zinc-200/80 bg-white text-zinc-950 shadow-sm ring-1 ring-black/[0.03] transition-shadow duration-300 hover:shadow-md',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        'font-semibold leading-none tracking-tight text-zinc-900',
        className,
      )}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm text-zinc-500', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return (
    <div data-slot="card-content" className={cn('px-6 pb-6', className)} {...props} />
  )
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 pb-6 pt-0', className)}
      {...props}
    />
  )
}
