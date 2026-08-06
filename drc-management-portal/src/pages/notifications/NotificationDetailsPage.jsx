import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { DetailItem, PageHeader, SectionCard } from '@/components/shared'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { formatDateTime } from '@/utils/formatDate'

export default function NotificationDetailsPage() {
  const { id } = useParams()
  const { notifications, markAsRead } = useNotifications()
  const notification = notifications.find((item) => item.id === id)

  useEffect(() => {
    if (notification && !notification.read) {
      markAsRead(notification.id)
    }
  }, [notification, markAsRead])

  if (!notification) {
    return (
      <section aria-label="Notification Details" className="flex flex-col gap-6">
        <PageHeader
          title="Notification Not Found"
          description="The notification you are looking for does not exist."
          backTo={ROUTE_PATHS.NOTIFICATIONS}
          backLabel="Back to Notifications"
        />
      </section>
    )
  }

  return (
    <section aria-label="Notification Details" className="flex flex-col gap-6">
      <PageHeader
        title={notification.title}
        description={notification.recipient || 'System notification'}
        backTo={ROUTE_PATHS.NOTIFICATIONS}
        backLabel="Back to Notifications"
        actions={
          <>
            <Badge variant="muted">{notification.type || 'general'}</Badge>
            <Badge variant={notification.read ? 'muted' : 'default'}>
              {notification.read ? 'Read' : 'Unread'}
            </Badge>
          </>
        }
      />

      <SectionCard title="Notification Information">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Title" value={notification.title} />
          <DetailItem label="Recipient" value={notification.recipient || '—'} />
          <DetailItem label="Type" value={notification.type || 'general'} />
          <DetailItem label="Status" value={notification.read ? 'Read' : 'Unread'} />
          <DetailItem label="Sent" value={formatDateTime(notification.createdAt)} />
        </div>
      </SectionCard>

      <SectionCard title="Message">
        <p className="whitespace-pre-wrap text-sm text-foreground">{notification.message}</p>
      </SectionCard>
    </section>
  )
}
