import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

export default function ModuleSubNav({ items }) {
  return (
    <nav className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/30 p-1" aria-label="Module navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              isActive ? 'bg-background text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
