import { Plus, Scale } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, EmptyState, PageHeader } from '@/components/shared'
import { useServices } from '@/features/services/context/ServicesContext'
import { caseDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'
import { useAuth } from '@/store/AuthContext'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
function getStatusLabel(status) {
  const labels = {
    active: 'Active',
    open: 'Open',
    in_progress: 'In Progress',
    pending: 'Pending',
    closed: 'Closed',
  }
  return labels[status] ?? status
}
function getStatusVariant(status) {
  switch (status) {
    case 'active':
    case 'open':
      return 'default'
    case 'in_progress':
      return 'warning'
    case 'pending':
      return 'secondary'
    case 'closed':
      return 'success'
    default:
      return 'muted'
  }
}
const columns = [
  {
    key: 'caseId',
    header: 'Case ID',
    render: (row) => <span className="font-medium">{row.caseId ?? row.caseNumber ?? '—'}</span>,
  },
  {
    key: 'title',
    header: 'Title',
  },
  {
    key: 'caseType',
    header: 'Type',
    render: (row) => row.caseType?.replace(/_/g, ' ') ?? '—',
  },
  {
    key: 'startDate',
    header: 'Start Date',
    render: (row) => formatDate(row.startDate ?? row.openedDate),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={getStatusVariant(row.status)}>
        {getStatusLabel(row.status)}
      </Badge>
    ),
  },
]
export default function CasesListPage() {
  const navigate = useNavigate()
  const { cases } = useServices()
  const { hasRole } = useAuth()
  const canCreate = hasRole('Admin') || hasRole('Sub Admin')
  const isEmpty = cases.length === 0
  return (
    <section aria-label="Cases" className="flex flex-col gap-6">
      <PageHeader
        title="Cases"
        description="Manage dispute resolution cases and client services."
        actions={
          canCreate ? (
            <Button asChild>
              <Link to={ROUTE_PATHS.CASE_CREATE}>
                <Plus className="size-4" aria-hidden="true" />
                Create Case
              </Link>
            </Button>
          ) : null
        }
      />
      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isEmpty ? (
            <EmptyState
              icon={Scale}
              title="No cases yet"
              description="Create your first case to start managing services."
              action={
                canCreate ? (
                  <Button asChild>
                    <Link to={ROUTE_PATHS.CASE_CREATE}>
                      <Plus className="size-4" aria-hidden="true" />
                      Create Case
                    </Link>
                  </Button>
                ) : null
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={cases}
              onRowClick={(caseItem) => navigate(caseDetailsPath(caseItem.id))}
            />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
