import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/features/training/utils/courseStatus'

export default function CourseStatusBadge({ status }) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
