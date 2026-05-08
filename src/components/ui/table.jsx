import { cn } from '@/lib/utils'

export function TableContainer({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className={cn('relative w-full overflow-x-auto', className)}
      {...props}
    />
  )
}

export function Table({ className, ...props }) {
  return (
    <table
      data-slot="table"
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  )
}

export function TableHeader({ className, ...props }) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />
}

export function TableBody({ className, ...props }) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-zinc-100 transition-colors hover:bg-zinc-50/70',
        className,
      )}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-semibold tracking-wide text-zinc-500',
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn('px-4 py-3 align-middle text-zinc-800', className)}
      {...props}
    />
  )
}
