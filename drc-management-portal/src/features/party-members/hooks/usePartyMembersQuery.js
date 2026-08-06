import { useQuery } from '@tanstack/react-query'
import { usePartyMembers } from '@/features/party-members/context/PartyMembersContext'

export function usePartyMembersQuery() {
  const { members } = usePartyMembers()

  return useQuery({
    queryKey: ['party-members'],
    queryFn: async () => members,
    staleTime: 30_000,
  })
}
