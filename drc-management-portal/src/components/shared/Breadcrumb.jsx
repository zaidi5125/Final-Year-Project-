import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export default function Breadcrumb({ items, className }) {
  if (!items?.length) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
            {isLast || !item.to ? (
              <span className={isLast ? 'font-medium text-foreground' : ''}>{item.label}</span>
            ) : (
              <Link to={item.to} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
