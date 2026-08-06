import { useMemo, useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { DataTable, EmptyState, FormField, ModuleSubNav, PageHeader } from '@/components/shared'
import LeadImportDropzone from '@/features/leads/components/LeadImportDropzone'
import LeadStatusBadge from '@/features/leads/components/LeadStatusBadge'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { getTypeLabel } from '@/features/leads/utils/leadStatus'
import { leadDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'
import { formatDateTime } from '@/utils/formatDate'

const SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.LEADS_LIST, end: true },
  { label: 'Board', to: ROUTE_PATHS.LEADS_BOARD },
  { label: 'Dashboard', to: ROUTE_PATHS.LEADS_DASHBOARD },
]

export default function LeadsListPage() {
  const navigate = useNavigate()
  const { leads, bulkImportLeads } = useLeads()
  const [typeFilter, setTypeFilter] = useState('')

  const filteredLeads = useMemo(() => {
    if (!typeFilter) return leads
    return leads.filter((lead) => lead.type === typeFilter)
  }, [leads, typeFilter])

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
      render: (row) => row.company || '—',
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => getTypeLabel(row.type),
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
    <section aria-label="Leads List" className="flex flex-col gap-6">
      <PageHeader
        title="Leads"
        description="Track and manage course and dispute leads."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.LEAD_CREATE}>
              <Plus className="size-4" aria-hidden="true" />
              Add Lead
            </Link>
          </Button>
        }
      />

      <ModuleSubNav items={SUB_NAV_ITEMS} />

      <LeadImportDropzone onImport={bulkImportLeads} />

      <div className="flex flex-wrap items-end gap-4">
        <FormField label="Filter by type" htmlFor="typeFilter" className="w-full sm:w-48">
          <Select
            id="typeFilter"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="">All types</option>
            <option value="course">Course</option>
            <option value="dispute">Dispute</option>
          </Select>
        </FormField>
      </div>

      <Card>
        <CardContent className={filteredLeads.length === 0 ? 'p-0' : 'p-0 pt-6'}>
          <DataTable
            columns={columns}
            data={filteredLeads}
            onRowClick={(row) => navigate(leadDetailsPath(row.id))}
            emptyState={
              <EmptyState
                icon={Target}
                title="No leads yet"
                description={
                  typeFilter
                    ? `No ${typeFilter} leads found. Try a different filter or add a new lead.`
                    : 'Add your first lead to start tracking prospects.'
                }
                action={
                  <Button asChild>
                    <Link to={ROUTE_PATHS.LEAD_CREATE}>
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
