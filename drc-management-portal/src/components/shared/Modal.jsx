import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export default function Modal({ open, onClose, title, description, children, className, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClass = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} aria-label="Close modal overlay" />
      <div className={cn('relative z-50 w-full rounded-xl border border-border bg-background shadow-soft-lg', sizeClass, className)} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
