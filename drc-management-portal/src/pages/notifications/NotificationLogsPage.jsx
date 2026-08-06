import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ActivityTimeline, ModuleSubNav, PageHeader } from '@/components/shared'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { NOTIFICATIONS_SUB_NAV_ITEMS } from '@/pages/notifications/NotificationsPage'

function formatLogAction(action) {
  return action.replace(/_/g, ' ')
}

export default function NotificationLogsPage() {
  const { logs } = useNotifications()

  const activities = useMemo(
    () =>
      logs.map((log) => ({
        id: log.id,
        title: formatLogAction(log.action),
        description: log.message,
        createdAt: log.createdAt,
      })),
    [logs],
  )

  return (
    <section aria-label="Notification Logs" className="flex flex-col gap-6">
      <PageHeader
        title="Notification Logs"
        description="Track notification activity from automatic system events."
      />

      <ModuleSubNav items={NOTIFICATIONS_SUB_NAV_ITEMS} />

      <Card>
        <CardContent className="pt-6">
          <ActivityTimeline
            activities={activities}
            emptyTitle="No logs yet"
            emptyDescription="Logs will appear here when notifications are sent from this module or other system actions."
          />
        </CardContent>
      </Card>
    </section>
  )
}
