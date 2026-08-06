import { BarChart3, CheckCircle2, FileText, Microscope, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, ModuleSubNav, PageHeader } from '@/components/shared'
import { useResearches } from '@/features/researches/context/ResearchesContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

const subNavItems = [
  { label: 'List', to: ROUTE_PATHS.RESEARCHES, end: true },
  { label: 'Dashboard', to: ROUTE_PATHS.RESEARCH_DASHBOARD },
]

function StatWidget({ title, value, icon: Icon, isEmpty }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState
            icon={Icon}
            title="No data"
            description="Stats will appear once researches are created."
            className="py-6"
          />
        ) : (
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function ResearchDashboardPage() {
  const { researches } = useResearches()
  const isEmpty = researches.length === 0

  const ongoingCount = researches.filter((r) => r.status === 'in_progress').length
  const completedCount = researches.filter((r) => r.status === 'completed').length
  const researcherCount = researches.reduce(
    (total, research) => total + (research.researchers?.length ?? 0),
    0,
  )
  const documentCount = researches.reduce((total, research) => {
    const mainDoc = research.researchDocument ? 1 : 0
    return total + mainDoc + (research.files?.length ?? 0)
  }, 0)

  return (
    <section aria-label="Research Dashboard" className="flex flex-col gap-6">
      <PageHeader
        title="Research Dashboard"
        description="Overview of research projects and activity."
      />

      <ModuleSubNav items={subNavItems} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatWidget
          title="Total Researches"
          value={researches.length}
          icon={Microscope}
          isEmpty={isEmpty}
        />
        <StatWidget
          title="In Progress"
          value={ongoingCount}
          icon={BarChart3}
          isEmpty={isEmpty}
        />
        <StatWidget
          title="Completed"
          value={completedCount}
          icon={CheckCircle2}
          isEmpty={isEmpty}
        />
        <StatWidget
          title="Researchers"
          value={researcherCount}
          icon={Users}
          isEmpty={isEmpty}
        />
        <StatWidget
          title="Documents"
          value={documentCount}
          icon={FileText}
          isEmpty={isEmpty}
        />
      </div>
    </section>
  )
}
