import { Clock } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { formatDateTime } from '@/utils/formatDate'

export default function ActivityTimeline({ activities, emptyTitle = 'No activity yet', emptyDescription = 'Activity will appear here as actions are taken.' }) {
  if (!activities?.length) {
    return <EmptyState icon={Clock} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {activities.map((activity) => (
        <li key={activity.id} className="relative">
          <span className="absolute -left-[25px] top-1 size-3 rounded-full border-2 border-background bg-primary" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{activity.title}</p>
          {activity.description && <p className="mt-0.5 text-xs text-muted-foreground">{activity.description}</p>}
          <p className="mt-1 text-[10px] text-muted-foreground">{formatDateTime(activity.createdAt)}</p>
        </li>
      ))}
    </ol>
  )
}
