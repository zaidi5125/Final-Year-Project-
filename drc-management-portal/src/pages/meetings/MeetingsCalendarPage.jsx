import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, ModuleSubNav, PageHeader } from '@/components/shared'
import MeetingsCalendar from '@/features/meetings/components/MeetingsCalendar'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { formatDisplayDate, formatTimeLabel } from '@/features/home-dashboard/utils/calendar'
import { meetingDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

const SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.MEETINGS },
  { label: 'Calendar', to: ROUTE_PATHS.MEETINGS_CALENDAR, end: true },
]

export default function MeetingsCalendarPage() {
  const navigate = useNavigate()
  const { getMeetingsForDate } = useMeetings()
  const [selectedDate, setSelectedDate] = useState(null)

  const selectedMeetings = selectedDate ? getMeetingsForDate(selectedDate) : []

  return (
    <section aria-label="Meetings Calendar" className="flex flex-col gap-6">
      <PageHeader
        title="Meetings"
        description="View meetings on the calendar and plan your schedule."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.MEETING_CREATE}>
              <Plus className="size-4" aria-hidden="true" />
              Schedule Meeting
            </Link>
          </Button>
        }
      />

      <ModuleSubNav items={SUB_NAV_ITEMS} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MeetingsCalendar onDateSelect={setSelectedDate} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate ? formatDisplayDate(selectedDate) : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground">
                Click a date on the calendar to view scheduled meetings.
              </p>
            ) : selectedMeetings.length === 0 ? (
              <EmptyState
                title="No meetings"
                description="No meetings scheduled for this date."
                action={
                  <Button asChild size="sm">
                    <Link to={ROUTE_PATHS.MEETING_CREATE}>
                      <Plus className="size-4" aria-hidden="true" />
                      Schedule Meeting
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="flex flex-col gap-2">
                {selectedMeetings.map((meeting) => (
                  <li key={meeting.id}>
                    <button
                      type="button"
                      onClick={() => navigate(meetingDetailsPath(meeting.id))}
                      className="w-full rounded-lg border border-border px-3 py-2 text-left transition-colors hover:bg-muted/40"
                    >
                      <p className="text-sm font-medium">{meeting.title}</p>
                      {meeting.time && (
                        <p className="text-xs text-muted-foreground">
                          {formatTimeLabel(meeting.time)}
                        </p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
