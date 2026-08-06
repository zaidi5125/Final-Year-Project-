import { Bell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, ModuleSubNav, PageHeader } from '@/components/shared'
import NotificationsTable from '@/features/notifications/components/NotificationsTable'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

export const NOTIFICATIONS_SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.NOTIFICATIONS, end: true },
  { label: 'Logs', to: ROUTE_PATHS.NOTIFICATION_LOGS },
  { label: 'Preferences', to: ROUTE_PATHS.NOTIFICATION_PREFERENCES },
]

export default function NotificationsPage() {
  const { notifications } = useNotifications()
  const isEmpty = notifications.length === 0

  return (
    <section aria-label="Notifications" className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Notifications are sent automatically when you create tasks, teams, meetings, and other records."
      />

      <ModuleSubNav items={NOTIFICATIONS_SUB_NAV_ITEMS} />

      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isEmpty ? (
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              description="Notifications will appear here automatically when actions are taken across the portal."
            />
          ) : (
            <NotificationsTable notifications={notifications} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
