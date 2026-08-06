import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import LeadForm from '@/features/leads/components/LeadForm'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { leadDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function AddLeadPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addLead } = useLeads()

  const defaultType = location.state?.defaultType ?? 'course'

  const handleSubmit = async (data) => {
    const lead = await addLead(data)
    if (!lead) return
    navigate(leadDetailsPath(lead.id))
  }

  const handleCancel = () => {
    navigate(ROUTE_PATHS.LEADS_LIST)
  }

  return (
    <section aria-label="Add Lead" className="flex flex-col gap-6">
      <PageHeader
        title="Add Lead"
        description="Create a new course or dispute lead."
        backTo={ROUTE_PATHS.LEADS_LIST}
        backLabel="Back to Leads"
      />
      <Card>
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm
            submitLabel="Add Lead"
            initialValues={{ name: '', email: '', phone: '', company: '', type: defaultType, status: 'new', notes: '' }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}

