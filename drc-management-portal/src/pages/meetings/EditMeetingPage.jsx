import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import MeetingForm from '@/features/meetings/components/MeetingForm'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { ROUTE_PATHS, meetingDetailsPath } from '@/routes/routePaths'

export default function EditMeetingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getMeetingById, updateMeeting } = useMeetings()
  const meeting = getMeetingById(id)

  if (!meeting) {
    return (
      <section aria-label="Edit Meeting" className="flex flex-col gap-6">
        <PageHeader
          title="Meeting Not Found"
          description="The meeting you are looking for does not exist."
          backTo={ROUTE_PATHS.MEETINGS}
          backLabel="Back to Meetings"
        />
      </section>
    )
  }

  const handleSubmit = (data) => {
    updateMeeting(id, data)
    navigate(meetingDetailsPath(id))
  }

  const handleCancel = () => {
    navigate(meetingDetailsPath(id))
  }

  return (
    <section aria-label="Edit Meeting" className="flex flex-col gap-6">
      <PageHeader
        title="Edit Meeting"
        description={`Update details for "${meeting.title}".`}
        backTo={meetingDetailsPath(id)}
        backLabel="Back to Meeting"
      />

      <Card>
        <CardHeader>
          <CardTitle>Meeting Information</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingForm
            initialValues={{
              title: meeting.title,
              date: meeting.date,
              time: meeting.time ?? '',
              participants: meeting.participants ?? '',
              meetingType: meeting.meetingType ?? '',
              description: meeting.description ?? '',
              reminder: meeting.reminder ?? '',
              internalParticipants: meeting.internalParticipants ?? [],
              externalParticipants: meeting.externalParticipants ?? [],
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
