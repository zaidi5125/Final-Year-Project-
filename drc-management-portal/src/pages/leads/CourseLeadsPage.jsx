import { useMemo } from 'react'
import { GraduationCap, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, EmptyState, PageHeader } from '@/components/shared'
import LeadImportDropzone from '@/features/leads/components/LeadImportDropzone'
import LeadStatusBadge from '@/features/leads/components/LeadStatusBadge'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { leadDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'
import { formatDateTime } from '@/utils/formatDate'

export default function CourseLeadsPage() {
  const navigate = useNavigate()
  const { leads, bulkImportLeads } = useLeads()

  const courseLeads = useMemo(
    () => leads.filter((lead) => lead.type === 'course'),
    [leads],
  )

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'company',
      header: 'Company',
      render: (row) => row.company || 'â€”',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <LeadStatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => formatDateTime(row.createdAt),
    },
  ]

  return (
    <section aria-label="Course Leads" className="flex flex-col gap-6">
      <PageHeader
        title="Course Leads"
        description="Leads interested in training courses."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.LEAD_CREATE} state={{ defaultType: 'course' }}>
              <Plus className="size-4" aria-hidden="true" />
              Add Lead
            </Link>
          </Button>
        }
      />

      <LeadImportDropzone onImport={(rows) => bulkImportLeads(rows.map((r) => ({ ...r, type: r.type || 'course' })))} />

      <Card>
        <CardContent className={courseLeads.length === 0 ? 'p-0' : 'p-0 pt-6'}>
          <DataTable
            columns={columns}
            data={courseLeads}
            onRowClick={(row) => navigate(leadDetailsPath(row.id))}
            emptyState={
              <EmptyState
                icon={GraduationCap}
                title="No course leads yet"
                description="Course leads will appear here once added."
                action={
                  <Button asChild>
                    <Link to={ROUTE_PATHS.LEAD_CREATE} state={{ defaultType: 'course' }}>
                      <Plus className="size-4" aria-hidden="true" />
                      Add Lead
                    </Link>
                  </Button>
                }
              />
            }
          />
        </CardContent>
      </Card>
    </section>
  )
}


