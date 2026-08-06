import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { NAVIGATION_ITEMS } from '@/routes/navigation'
import { useAuth } from '@/store/AuthContext'

function SidebarLink({ item, end }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      end={end}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-soft'
            : 'text-sidebar-foreground hover:bg-white/5 hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary"
              aria-hidden="true"
            />
          )}
          <Icon
            className={cn(
              'size-[18px] shrink-0 transition-colors',
              isActive ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-white',
            )}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

function CollapsibleNavItem({ item }) {
  const location = useLocation()
  const Icon = item.icon
  const childPaths = item.children?.map((child) => child.path) ?? []
  const isSectionActive =
    location.pathname === item.path ||
    childPaths.some((path) => location.pathname.startsWith(path))

  const [isOpen, setIsOpen] = useState(isSectionActive)

  useEffect(() => {
    if (isSectionActive) {
      setIsOpen(true)
    }
  }, [isSectionActive])

  return (
    <li>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isSectionActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-white/5 hover:text-white',
        )}
      >
        <Icon
          className={cn(
            'size-[18px] shrink-0',
            isSectionActive ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-white',
          )}
          aria-hidden="true"
        />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-sidebar-muted transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <ul className="overflow-hidden">
          <li className="mt-1 ml-5 border-l border-sidebar-border pl-3">
            <ul className="space-y-0.5">
              {item.children.map((child) => (
                <li key={child.path}>
                  <NavLink
                    to={child.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-sidebar-primary/20 font-medium text-white'
                          : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'size-1.5 shrink-0 rounded-full',
                            isActive ? 'bg-sidebar-primary' : 'bg-sidebar-muted',
                          )}
                          aria-hidden="true"
                        />
                        <span>{child.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </li>
  )
}

function NavItem({ item }) {
  if (item.children?.length > 0) {
    return <CollapsibleNavItem item={item} />
  }

  return (
    <li>
      <SidebarLink item={item} end={item.path === ROUTE_PATHS.HOME} />
    </li>
  )
}

export default function Sidebar({ className }) {
  const { hasRole } = useAuth()

  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    if (!item.allowedRoles) return true
    return item.allowedRoles.some((role) => hasRole(role))
  })

  return (
    <aside
      className={cn(
        'flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <img
          src="/drc-logo.svg"
          alt="DRC Management Portal"
          className="size-9 shrink-0 rounded-xl object-contain"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">DRC Portal</p>
          <p className="truncate text-xs text-sidebar-muted">Dispute Resolution Center</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  )
}
