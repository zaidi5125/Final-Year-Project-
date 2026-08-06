import { Plus, Target, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModuleSubNav, PageHeader } from '@/components/shared'
import LeadImportDropzone from '@/features/leads/components/LeadImportDropzone'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

const SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.LEADS_LIST },
  { label: 'Board', to: ROUTE_PATHS.LEADS_BOARD },
  { label: 'Dashboard', to: ROUTE_PATHS.LEADS_DASHBOARD, end: true },
]

export default function LeadsDashboardPage() {
  const { leads, bulkImportLeads } = useLeads()

  const totalLeads = leads.length
  const courseLeads = leads.filter((lead) => lead.type === 'course').length
  const disputeLeads = leads.filter((lead) => lead.type === 'dispute').length
  const convertedLeads = leads.filter((lead) => lead.status === 'converted').length

  const stats = [
    { label: 'Total Leads', value: totalLeads, icon: Target },
    { label: 'Course Leads', value: courseLeads, icon: Users },
    { label: 'Dispute Leads', value: disputeLeads, icon: Users },
    { label: 'Converted', value: convertedLeads, icon: TrendingUp },
  ]

  return (
    <section aria-label="Leads Dashboard" className="flex flex-col gap-6">
      <PageHeader
        title="Leads Dashboard"
        description="Overview of lead activity and conversion metrics."
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
