import { FileText, Pencil, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  ActivityTimeline,
  DataTable,
  DetailItem,
  EmptyState,
  PageHeader,
  SectionCard,
} from '@/components/shared'
import ResearchDocumentsSection from '@/features/researches/components/ResearchDocumentsSection'
import BeneficiariesSection from '@/features/researches/components/BeneficiariesSection'
import ResearchStatusBadge from '@/features/researches/components/ResearchStatusBadge'
import { useResearches } from '@/features/researches/context/ResearchesContext'
import { getResearcherLevelLabel } from '@/features/researches/utils/researchStatus'
import { researchEditPath, ROUTE_PATHS } from '@/routes/routePaths'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const researcherColumns = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: 'researcherRole',
    header: 'Role',
    render: (row) => getResearcherLevelLabel(row.researcherRole) || '—',
  },
]

export default function ResearchDetailsPage() {
  const { id } = useParams()
  const { getResearchById } = useResearches()
  const research = getResearchById(id)

  if (!research) {
    return (
      <section aria-label="Research Details" className="flex flex-col gap-6">
        <PageHeader
          title="Research Not Found"
          description="The research you are looking for does not exist."
          backTo={ROUTE_PATHS.RESEARCHES}
          backLabel="Back to Researches"
        />
      </section>
    )
  }

  return (
    <section aria-label="Research Details" className="flex flex-col gap-6">
      <PageHeader
        title={research.title}
        description={research.topic}
        backTo={ROUTE_PATHS.RESEARCHES}
        backLabel="Back to Researches"
        actions={
          <>
            <ResearchStatusBadge status={research.status} />
            <Button variant="outline" asChild>
              <Link to={researchEditPath(id)}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit Research
              </Link>
            </Button>
          </>
        }
      />

      <SectionCard title="Overview">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Title" value={research.title} />
          <DetailItem label="Topic" value={research.topic} />
          <DetailItem label="Description" value={research.description ?? research.purpose ?? '—'} />
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
            <ResearchStatusBadge status={research.status} />
          </div>
          <DetailItem label="Start Date" value={formatDate(research.startDate)} />
          <DetailItem label="End Date" value={formatDate(research.endDate)} />
        </div>
      </SectionCard>

      <SectionCard title="Researchers">
        <DataTable
          columns={researcherColumns}
          data={research.researchers}
          emptyState={
            <EmptyState
              icon={Users}
              title="No researchers added"
              description="Researchers assigned to this project will appear here."
            />
          }
        />
      </SectionCard>

      <ResearchDocumentsSection research={research} id={id} />

      <BeneficiariesSection researchId={id} />

      <SectionCard title="Activity">
        <ActivityTimeline activities={research.activities} />
      </SectionCard>
    </section>
  )
}
