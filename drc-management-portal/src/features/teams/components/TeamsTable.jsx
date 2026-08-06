import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/shared'
import { useTeamMembersStore } from '@/features/teams/context/TeamMembersContext'
import { teamDetailsPath } from '@/routes/routePaths'
import { formatDate } from '@/utils/formatDate'

const columns = [
  {
    key: 'teamName',
    header: 'Team Name',
    render: (row) => <span className="font-medium">{row.teamName}</span>,
  },
  {
    key: 'createdDate',
    header: 'Created Date',
    render: (row) => formatDate(row.createdDate ?? row.createdAt),
  },
  {
    key: 'memberCount',
    header: 'Members',
    render: (row) => row.memberCount ?? 0,
  },
]

export default function TeamsTable({ teams }) {
  const navigate = useNavigate()
  const { getMembersByTeam } = useTeamMembersStore()

  const rows = teams.map((team) => ({
    ...team,
    memberCount: getMembersByTeam(team.id).length,
  }))

  return (
    <DataTable
      columns={columns}
      data={rows}
      onRowClick={(team) => navigate(teamDetailsPath(team.id))}
    />
  )
}
