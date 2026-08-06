import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/features/tasks/utils/taskStatus'

export default function TaskStatusBadge({ status }) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
