import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import TeamForm from '@/features/teams/components/TeamForm'
import { useTeams } from '@/features/teams/context/TeamsContext'
import { ROUTE_PATHS, teamDetailsPath } from '@/routes/routePaths'

export default function EditTeamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTeamById, updateTeam } = useTeams()
  const team = getTeamById(id)

  if (!team) {
    return (
      <section aria-label="Edit Team" className="flex flex-col gap-6">
        <PageHeader
          title="Team Not Found"
          description="The team you are looking for does not exist."
          backTo={ROUTE_PATHS.TEAMS}
          backLabel="Back to Teams"
        />
      </section>
    )
  }

  const handleSubmit = (data) => {
    const { pendingMembers: _pending, ...teamData } = data
    updateTeam(id, teamData)
    navigate(teamDetailsPath(id))
  }

  const handleCancel = () => {
    navigate(teamDetailsPath(id))
  }

  return (
    <section aria-label="Edit Team" className="flex flex-col gap-6">
      <PageHeader
        title="Edit Team"
        description={`Update details for ${team.teamName}.`}
        backTo={teamDetailsPath(id)}
        backLabel="Back to Team"
      />

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamForm
            teamId={id}
            initialValues={{
              teamName: team.teamName,
              description: team.description,
              createdDate: team.createdDate ?? team.createdAt?.slice(0, 10),
            }}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
