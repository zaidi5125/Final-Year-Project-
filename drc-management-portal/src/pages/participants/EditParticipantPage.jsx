import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import ParticipantForm from '@/features/participants/components/ParticipantForm'
import { useParticipants } from '@/features/participants/context/ParticipantsContext'
import { getParticipantDisplayName } from '@/features/participants/utils/participantFields'
import { participantDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function EditParticipantPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getParticipantById, updateParticipant } = useParticipants()
  const participant = getParticipantById(id)

  if (!participant) {
    return (
      <section aria-label="Edit Participant" className="flex flex-col gap-6">
        <PageHeader
          title="Participant Not Found"
          description="The participant you are looking for does not exist."
          backTo={ROUTE_PATHS.PARTICIPANTS}
          backLabel="Back to Participants"
        />
      </section>
    )
  }

  const handleSubmit = (data) => {
    updateParticipant(id, data)
    navigate(participantDetailsPath(id))
  }

  const handleCancel = () => {
    navigate(participantDetailsPath(id))
  }

  return (
    <section aria-label="Edit Participant" className="flex flex-col gap-6">
      <PageHeader
        title="Edit Participant"
        description={`Update details for ${getParticipantDisplayName(participant)}.`}
        backTo={participantDetailsPath(id)}
        backLabel="Back to Participant"
      />

      <Card>
        <CardHeader>
          <CardTitle>Participant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ParticipantForm
            initialValues={{
              participantId: participant.participantId,
              profileImage: participant.profileImage,
              fullName: participant.fullName ?? participant.name,
              fatherName: participant.fatherName,
              gender: participant.gender,
              status: participant.status,
              contactNumber: participant.contactNumber ?? participant.phone,
              email: participant.email,
              cnic: participant.cnic,
              city: participant.city,
              address: participant.address,
              enrolledDate: participant.enrolledDate,
              sessionYear: participant.sessionYear,
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
