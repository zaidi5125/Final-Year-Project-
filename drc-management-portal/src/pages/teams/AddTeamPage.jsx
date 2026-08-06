import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import TeamForm from '@/features/teams/components/TeamForm'
import { useTeamMembersStore } from '@/features/teams/context/TeamMembersContext'
import { useTeams } from '@/features/teams/context/TeamsContext'
import { ROUTE_PATHS, teamDetailsPath } from '@/routes/routePaths'

export default function AddTeamPage() {
  const navigate = useNavigate()
  const { addTeam } = useTeams()
  const { addTeamMember, assignMemberToTeam, members } = useTeamMembersStore()

  const handleSubmit = (data) => {
    const { pendingMembers = [], ...teamData } = data
    const team = addTeam(teamData)

    pendingMembers.forEach((member) => {
      const existing = members.find(
        (m) => m.cnic === member.cnic || m.email === member.email,
      )
      if (existing) {
        assignMemberToTeam(team.id, existing.id, member.joiningDate)
      } else {
        const created = addTeamMember(member)
        if (created) {
          assignMemberToTeam(team.id, created.id, member.joiningDate)
        }
      }
    })

    navigate(teamDetailsPath(team.id))
  }

  const handleCancel = () => {
    navigate(ROUTE_PATHS.TEAMS)
  }

  return (
    <section aria-label="Create Team" className="flex flex-col gap-6">
      <PageHeader
        title="Create Team"
        description="Add a new team and assign members."
        backTo={ROUTE_PATHS.TEAMS}
        backLabel="Back to Teams"
      />

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamForm
            submitLabel="Create Team"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
