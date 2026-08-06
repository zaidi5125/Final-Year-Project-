import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/features/leads/utils/leadStatus'

export default function LeadStatusBadge({ status }) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
