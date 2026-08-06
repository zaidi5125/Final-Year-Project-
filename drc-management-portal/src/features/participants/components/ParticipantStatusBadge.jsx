import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/features/participants/utils/participantFields'

export default function ParticipantStatusBadge({ status }) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
