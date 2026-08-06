import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, PageHeader } from '@/components/shared'
import ParticipantForm from '@/features/participants/components/ParticipantForm'
import { useParticipants } from '@/features/participants/context/ParticipantsContext'
import { participantDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function AddParticipantPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addParticipant } = useParticipants()
  const returnTo = location.state?.returnTo
  const returnLabel = location.state?.returnLabel ?? 'Back to Participants'

  const handleSubmit = async (data) => {
    const participant = await addParticipant(data)
    if (!participant) return
    if (returnTo) {
      navigate(returnTo, { state: { newParticipantId: participant.id } })
      return
    }
    navigate(participantDetailsPath(participant.id))
  }

  const handleCancel = () => {
    navigate(returnTo ?? ROUTE_PATHS.PARTICIPANTS)
  }

  return (
    <section aria-label="Add Participant" className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Participants', to: ROUTE_PATHS.PARTICIPANTS },
          { label: 'Add Participant' },
        ]}
      />
      <PageHeader
        title="Add Participant"
        description="Register a new participant in the system."
        backTo={returnTo ?? ROUTE_PATHS.PARTICIPANTS}
        backLabel={returnLabel}
      />
      <Card>
        <CardHeader>
          <CardTitle>Participant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ParticipantForm
            submitLabel="Add Participant"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
