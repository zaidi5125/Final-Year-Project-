import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/shared'
import ResearchStatusBadge from '@/features/researches/components/ResearchStatusBadge'
import { researchDetailsPath } from '@/routes/routePaths'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const columns = [
  {
    key: 'title',
    header: 'Title',
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: 'topic',
    header: 'Topic',
  },
  {
    key: 'startDate',
    header: 'Start Date',
    render: (row) => formatDate(row.startDate),
  },
  {
    key: 'endDate',
    header: 'End Date',
    render: (row) => formatDate(row.endDate),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <ResearchStatusBadge status={row.status} />,
  },
]

export default function ResearchesTable({ researches }) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={researches}
      onRowClick={(research) => navigate(researchDetailsPath(research.id))}
    />
  )
}
