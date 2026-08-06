import { Badge } from '@/components/ui/badge'
import { getMemberStatusLabel, getMemberStatusVariant } from '@/features/teams/utils/teamMemberFields'

export default function TeamMemberStatusBadge({ status }) {
  return (
    <Badge variant={getMemberStatusVariant(status)}>
      {getMemberStatusLabel(status)}
    </Badge>
  )
}
