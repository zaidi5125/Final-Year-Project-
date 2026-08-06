import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared'
import { notificationDetailsPath } from '@/routes/routePaths'
import { formatDateTime } from '@/utils/formatDate'

const columns = [
  {
    key: 'title',
    header: 'Title',
    render: (row) => (
      <span className={row.read ? 'font-medium text-foreground' : 'font-semibold text-foreground'}>
        {row.title}
      </span>
    ),
  },
  {
    key: 'message',
    header: 'Message',
    render: (row) => (
      <span className="line-clamp-1 text-muted-foreground">{row.message}</span>
    ),
  },
  {
    key: 'recipient',
    header: 'Recipient',
    render: (row) => row.recipient || '—',
  },
  {
    key: 'type',
    header: 'Type',
    render: (row) => (
      <Badge variant="muted">{row.type || 'general'}</Badge>
    ),
  },
  {
    key: 'read',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.read ? 'muted' : 'default'}>
        {row.read ? 'Read' : 'Unread'}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Sent',
    render: (row) => formatDateTime(row.createdAt),
  },
]

export default function NotificationsTable({ notifications }) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={notifications}
      onRowClick={(notification) => navigate(notificationDetailsPath(notification.id))}
    />
  )
}
