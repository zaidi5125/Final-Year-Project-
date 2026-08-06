import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

function Sheet({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onOpenChange?.(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={() => onOpenChange?.(false)}
        aria-label="Close panel overlay"
      />
      {children}
    </div>
  )
}

function SheetContent({ className, children, onClose, ...props }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-soft-lg transition-transform duration-300',
        className,
      )}
      {...props}
    >
      {children}
      {onClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-4 top-4 text-muted-foreground"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      )}
    </aside>
  )
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 border-b border-border px-6 py-5 pr-14', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }) {
  return (
    <h2
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto px-6 py-5', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center gap-2 border-t border-border px-6 py-4', className)}
      {...props}
    />
  )
}

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter }
