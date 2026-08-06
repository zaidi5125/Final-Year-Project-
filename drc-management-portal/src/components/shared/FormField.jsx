import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'

export default function FormField({ label, htmlFor, children, className, required, error }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
