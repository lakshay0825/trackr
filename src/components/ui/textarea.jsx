import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-[100px] w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-[border,box-shadow] placeholder:text-zinc-400 focus-visible:border-indigo-400 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
