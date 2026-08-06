import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import LeadForm from '@/features/leads/components/LeadForm'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { leadDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function EditLeadPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getLeadById, updateLead } = useLeads()
  const lead = getLeadById(id)

  if (!lead) {
    return (
      <section aria-label="Edit Lead" className="flex flex-col gap-6">
        <PageHeader
          title="Lead Not Found"
          description="The lead you are looking for does not exist."
          backTo={ROUTE_PATHS.LEADS_LIST}
          backLabel="Back to Leads"
        />
      </section>
    )
  }

  const handleSubmit = (data) => {
    updateLead(id, data)
    navigate(leadDetailsPath(id))
  }

  const handleCancel = () => {
    navigate(leadDetailsPath(id))
  }

  return (
    <section aria-label="Edit Lead" className="flex flex-col gap-6">
      <PageHeader
        title="Edit Lead"
        description={`Update details for ${lead.name}.`}
        backTo={leadDetailsPath(id)}
        backLabel="Back to Lead"
      />

      <Card>
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm
            initialValues={{
              name: lead.name,
              email: lead.email,
              phone: lead.phone ?? '',
              company: lead.company ?? '',
              type: lead.type,
              status: lead.status,
              notes: lead.notes ?? '',
            }}
            submitLabel="Save Changes"
            showStatus
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
