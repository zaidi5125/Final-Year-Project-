import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DetailItem, PageHeader, SectionCard } from '@/components/shared'
import TeamMembersSection from '@/features/teams/components/TeamMembersSection'
import { useTeams } from '@/features/teams/context/TeamsContext'
import { ROUTE_PATHS, teamEditPath } from '@/routes/routePaths'
import { formatDate } from '@/utils/formatDate'

export default function TeamDetailsPage() {
  const { id } = useParams()
  const { getTeamById } = useTeams()
  const team = getTeamById(id)

  if (!team) {
    return (
      <section aria-label="Team Details" className="flex flex-col gap-6">
        <PageHeader
          title="Team Not Found"
          description="The team you are looking for does not exist."
          backTo={ROUTE_PATHS.TEAMS}
          backLabel="Back to Teams"
        />
      </section>
    )
  }

  return (
    <section aria-label="Team Details" className="flex flex-col gap-6">
      <PageHeader
        title={team.teamName}
        description={team.description || 'Team details and members.'}
        backTo={ROUTE_PATHS.TEAMS}
        backLabel="Back to Teams"
        actions={
          <Button variant="outline" asChild>
            <Link to={teamEditPath(id)}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit Team
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SectionCard title="Team Overview">
            <div className="grid gap-6 sm:grid-cols-2">
              <DetailItem label="Team Name" value={team.teamName} />
              <DetailItem
                label="Created Date"
                value={formatDate(team.createdDate ?? team.createdAt)}
              />
            </div>
            <div className="mt-6">
              <DetailItem
                label="Description"
                value={team.description || 'No description provided.'}
              />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="members">
          <TeamMembersSection teamId={id} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
