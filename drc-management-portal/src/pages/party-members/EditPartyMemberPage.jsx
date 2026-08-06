import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb, PageHeader } from '@/components/shared'
import PartyMemberForm from '@/features/party-members/components/PartyMemberForm'
import { usePartyMembers } from '@/features/party-members/context/PartyMembersContext'
import { partyMemberDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function EditPartyMemberPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPartyMemberById, updatePartyMember } = usePartyMembers()
  const member = getPartyMemberById(id)

  if (!member) {
    return (
      <PageHeader title="Member Not Found" backTo={ROUTE_PATHS.PARTY_MEMBERS} backLabel="Back" />
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Party Members', to: ROUTE_PATHS.PARTY_MEMBERS },
          { label: member.fullName, to: partyMemberDetailsPath(id) },
          { label: 'Edit' },
        ]}
      />

      <PageHeader
        title="Edit Party Member"
        description={member.fullName}
        backTo={partyMemberDetailsPath(id)}
        backLabel="Back to Details"
      />

      <PartyMemberForm
        initialValues={member}
        initialDocument={member.document}
        submitLabel="Save Changes"
        onSubmit={(data) => {
          updatePartyMember(id, data)
          navigate(partyMemberDetailsPath(id))
        }}
        onCancel={() => navigate(partyMemberDetailsPath(id))}
      />
    </section>
  )
}
