import { Bell, Calendar, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { cn } from '@/utils/cn'

function NotificationIcon({ type }) {
  const Icon = type === 'meeting' ? Calendar : CheckSquare
  return (
    <div
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full',
        type === 'meeting' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground',
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </div>
  )
}

function formatRelativeTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function NotificationsPanel() {
  const { notifications } = useNotifications()
  const isEmpty = notifications.length === 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {isEmpty ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="Notifications will appear here when you create meetings or tasks."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex gap-3 rounded-lg border border-border p-3"
              >
                <NotificationIcon type={notification.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
