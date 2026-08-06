import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/features/teams/utils/teamStatus'

export default function TeamStatusBadge({ status }) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
