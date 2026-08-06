import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import MeetingForm from '@/features/meetings/components/MeetingForm'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { ROUTE_PATHS, meetingDetailsPath } from '@/routes/routePaths'

export default function AddMeetingPage() {
  const navigate = useNavigate()
  const { addMeeting } = useMeetings()

  const handleSubmit = (data) => {
    const meeting = addMeeting(data)
    navigate(meetingDetailsPath(meeting.id))
  }

  const handleCancel = () => {
    navigate(ROUTE_PATHS.MEETINGS)
  }

  return (
    <section aria-label="Schedule Meeting" className="flex flex-col gap-6">
      <PageHeader
        title="Schedule Meeting"
        description="Create a new meeting and invite participants."
        backTo={ROUTE_PATHS.MEETINGS}
        backLabel="Back to Meetings"
      />

      <Card>
        <CardHeader>
          <CardTitle>Meeting Information</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingForm
            submitLabel="Schedule Meeting"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
