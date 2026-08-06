import { useMemo } from 'react'
import { useTeamMembersStore } from '@/features/teams/context/TeamMembersContext'
import { useTeams } from '@/features/teams/context/TeamsContext'

export function useTeamMembers() {
  const { teams } = useTeams()
  const { members, memberships } = useTeamMembersStore()

  return useMemo(() => {
    return memberships.map((membership) => {
      const member = members.find((m) => m.id === membership.memberId)
      const team = teams.find((t) => t.id === membership.teamId)
      if (!member) return null

      return {
        id: member.id,
        membershipId: membership.id,
        name: member.fullName,
        fullName: member.fullName,
        email: member.email,
        employeeId: member.teamMemberId,
        cnic: member.cnic,
        city: member.city,
        teamId: team?.id ?? '',
        teamName: team?.teamName ?? '',
      }
    }).filter(Boolean)
  }, [members, memberships, teams])
}
