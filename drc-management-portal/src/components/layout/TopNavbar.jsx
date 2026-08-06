import { Bell, ChevronDown, KeyRound, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { cn } from '@/utils/cn'
import { useAuth } from '@/store/AuthContext'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'

export default function TopNavbar({
  onMenuToggle,
  isSidebarCollapsed,
  isMobile,
  className,
}) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { notifications } = useNotifications()
  const unreadCount = notifications.filter((n) => !n.read).length
  const SidebarToggleIcon = isMobile
    ? Menu
    : isSidebarCollapsed
      ? PanelLeftOpen
      : PanelLeftClose

  async function handleLogout() {
    await logout()
    navigate(ROUTE_PATHS.LOGIN)
  }

  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 shadow-soft lg:px-6',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onMenuToggle}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="shrink-0"
        >
          <SidebarToggleIcon className="size-4" aria-hidden="true" />
        </Button>

        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search portal..."
            className="h-10 rounded-xl border-input bg-muted/30 pl-9 shadow-none focus-visible:bg-background"
            aria-label="Search portal"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground sm:hidden"
          aria-label="Search"
        >
          <Search className="size-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
          asChild
        >
          <Link to={ROUTE_PATHS.NOTIFICATIONS} className="relative">
            <Bell className="size-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-xl border-input bg-background px-2 shadow-soft hover:bg-muted/40"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="size-4" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground md:inline">
                Account
              </span>
              <ChevronDown className="hidden size-4 text-muted-foreground md:inline" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTE_PATHS.USER_SETTINGS}>
                <User className="size-4" aria-hidden="true" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTE_PATHS.CHANGE_PASSWORD}>
                <KeyRound className="size-4" aria-hidden="true" />
                Change Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}



