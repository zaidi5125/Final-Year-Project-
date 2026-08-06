import { useNavigate } from 'react-router-dom'
import { Breadcrumb, PageHeader } from '@/components/shared'
import PartyMemberForm from '@/features/party-members/components/PartyMemberForm'
import { usePartyMembers } from '@/features/party-members/context/PartyMembersContext'
import { partyMemberDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function AddPartyMemberPage() {
  const navigate = useNavigate()
  const { addPartyMember } = usePartyMembers()

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Party Members', to: ROUTE_PATHS.PARTY_MEMBERS },
          { label: 'Add Member' },
        ]}
      />

      <PageHeader
        title="Add Party Member"
        description="Add a member to a case party."
        backTo={ROUTE_PATHS.PARTY_MEMBERS}
        backLabel="Back to Party Members"
      />

      <PartyMemberForm
        submitLabel="Add Member"
        onSubmit={(data) => {
          const member = addPartyMember(data)
          if (member) navigate(partyMemberDetailsPath(member.id))
        }}
        onCancel={() => navigate(ROUTE_PATHS.PARTY_MEMBERS)}
      />
    </section>
  )
}
