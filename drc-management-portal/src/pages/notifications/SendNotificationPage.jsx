import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModuleSubNav, PageHeader } from '@/components/shared'
import SendNotificationForm from '@/features/notifications/components/SendNotificationForm'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { notificationDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

const SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.NOTIFICATIONS, end: true },
  { label: 'Send', to: ROUTE_PATHS.NOTIFICATION_SEND },
  { label: 'Logs', to: ROUTE_PATHS.NOTIFICATION_LOGS },
  { label: 'Preferences', to: ROUTE_PATHS.NOTIFICATION_PREFERENCES },
]

export default function SendNotificationPage() {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const handleSubmit = (data) => {
    const notification = addNotification({
      ...data,
      type: 'manual',
    })
    navigate(notificationDetailsPath(notification.id))
  }

  const handleCancel = () => {
    navigate(ROUTE_PATHS.NOTIFICATIONS)
  }

  return (
    <section aria-label="Send Notification" className="flex flex-col gap-6">
      <PageHeader
        title="Send Notification"
        description="Compose and send a notification to a recipient."
        backTo={ROUTE_PATHS.NOTIFICATIONS}
        backLabel="Back to Notifications"
      />

      <ModuleSubNav items={SUB_NAV_ITEMS} />

      <Card>
        <CardHeader>
          <CardTitle>Notification Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SendNotificationForm
            submitLabel="Send Notification"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
