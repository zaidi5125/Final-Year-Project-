import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/shared'
import ParticipantStatusBadge from '@/features/participants/components/ParticipantStatusBadge'
import { getParticipantDisplayName } from '@/features/participants/utils/participantFields'
import { participantDetailsPath } from '@/routes/routePaths'

const columns = [
  {
    key: 'participantId',
    header: 'ID',
    render: (row) => (
      <span className="font-mono text-xs">{row.participantId || '—'}</span>
    ),
  },
  {
    key: 'fullName',
    header: 'Name',
    render: (row) => <span className="font-medium">{getParticipantDisplayName(row)}</span>,
  },
  {
    key: 'email',
    header: 'Email',
  },
  {
    key: 'contactNumber',
    header: 'Contact',
    render: (row) => row.contactNumber || row.phone || '—',
  },
  {
    key: 'sessionYear',
    header: 'Session',
    render: (row) => row.sessionYear || '—',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <ParticipantStatusBadge status={row.status} />,
  },
]

export default function ParticipantsTable({ participants, emptyState }) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={participants}
      onRowClick={(participant) => navigate(participantDetailsPath(participant.id))}
      emptyState={emptyState}
    />
  )
}
