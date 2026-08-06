import { Badge } from '@/components/ui/badge'
import { getStatusLabel, getStatusVariant } from '@/features/researches/utils/researchStatus'

export default function ResearchStatusBadge({ status }) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
