import { useMemo } from 'react'
import { FileText, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, EmptyState, PageHeader } from '@/components/shared'
import LeadImportDropzone from '@/features/leads/components/LeadImportDropzone'
import LeadStatusBadge from '@/features/leads/components/LeadStatusBadge'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { leadDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'
import { formatDateTime } from '@/utils/formatDate'

export default function DisputeLeadsPage() {
  const navigate = useNavigate()
  const { leads, bulkImportLeads } = useLeads()

  const disputeLeads = useMemo(
    () => leads.filter((lead) => lead.type === 'dispute'),
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
    <section aria-label="Dispute Leads" className="flex flex-col gap-6">
      <PageHeader
        title="Dispute Leads"
        description="Leads related to dispute resolution services."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.LEAD_CREATE} state={{ defaultType: 'dispute' }}>
              <Plus className="size-4" aria-hidden="true" />
              Add Lead
            </Link>
          </Button>
        }
      />

      <LeadImportDropzone onImport={(rows) => bulkImportLeads(rows.map((r) => ({ ...r, type: 'dispute' })))} />

      <Card>
        <CardContent className={disputeLeads.length === 0 ? 'p-0' : 'p-0 pt-6'}>
          <DataTable
            columns={columns}
            data={disputeLeads}
            onRowClick={(row) => navigate(leadDetailsPath(row.id))}
            emptyState={
              <EmptyState
                icon={FileText}
                title="No dispute leads yet"
                description="Dispute leads will appear here once added."
                action={
                  <Button asChild>
                    <Link to={ROUTE_PATHS.LEAD_CREATE} state={{ defaultType: 'dispute' }}>
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


