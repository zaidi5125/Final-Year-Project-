import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { formatDisplayDate, formatTimeLabel } from '@/features/home-dashboard/utils/calendar'

export default function UpcomingMeetingsWidget() {
  const { meetings } = useMeetings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {meetings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No meetings scheduled"
            description="Create a meeting from the calendar to see it here."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {meetings.map((meeting) => (
              <li
                key={meeting.id}
                className="rounded-lg border border-border px-3 py-2"
              >
                <p className="text-sm font-medium">{meeting.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDisplayDate(meeting.date)}
                  {meeting.time ? ` · ${formatTimeLabel(meeting.time)}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
