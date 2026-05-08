import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Dialog(props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

export function DialogTrigger(props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

export function DialogPortal(props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-[3px] motion-reduce:backdrop-blur-none',
        className,
      )}
      {...props}
    />
  )
}

export function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 grid max-h-[92vh] w-full gap-0 overflow-hidden rounded-t-3xl border border-zinc-200 bg-white p-0 shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[90vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 ring-offset-white transition hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0">
          <X />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col gap-1 border-b border-zinc-100 px-6 pb-4 pt-6 text-left',
        className,
      )}
      {...props}
    />
  )
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-zinc-100 px-6 py-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg font-semibold tracking-tight text-zinc-900', className)}
      {...props}
    />
  )
}
