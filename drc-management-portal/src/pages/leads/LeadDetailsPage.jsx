import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DetailItem, PageHeader, SectionCard } from '@/components/shared'
import LeadStatusBadge from '@/features/leads/components/LeadStatusBadge'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { getStatusLabel, getTypeLabel } from '@/features/leads/utils/leadStatus'
import { leadEditPath, ROUTE_PATHS } from '@/routes/routePaths'
import { formatDateTime } from '@/utils/formatDate'

export default function LeadDetailsPage() {
  const { id } = useParams()
  const { getLeadById } = useLeads()
  const lead = getLeadById(id)

  if (!lead) {
    return (
      <section aria-label="Lead Details" className="flex flex-col gap-6">
        <PageHeader
          title="Lead Not Found"
          description="The lead you are looking for does not exist."
          backTo={ROUTE_PATHS.LEADS_LIST}
          backLabel="Back to Leads"
        />
      </section>
    )
  }

  return (
    <section aria-label="Lead Details" className="flex flex-col gap-6">
      <PageHeader
        title={lead.name}
        description={lead.email}
        backTo={ROUTE_PATHS.LEADS_LIST}
        backLabel="Back to Leads"
        actions={
          <>
            <LeadStatusBadge status={lead.status} />
            <Button variant="outline" asChild>
              <Link to={leadEditPath(id)}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit Lead
              </Link>
            </Button>
          </>
        }
      />

      <SectionCard title="Lead Information">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Name" value={lead.name} />
          <DetailItem label="Email" value={lead.email} />
          <DetailItem label="Phone" value={lead.phone} />
          <DetailItem label="Company" value={lead.company} />
          <DetailItem label="Type" value={getTypeLabel(lead.type)} />
          <DetailItem label="Status" value={getStatusLabel(lead.status)} />
          <DetailItem label="Created" value={formatDateTime(lead.createdAt)} />
        </div>
      </SectionCard>

      {lead.notes && (
        <SectionCard title="Notes">
          <p className="whitespace-pre-wrap text-sm text-foreground">{lead.notes}</p>
        </SectionCard>
      )}
    </section>
  )
}
