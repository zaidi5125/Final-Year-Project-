import { Calendar, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DetailItem } from '@/components/shared'
import { formatDisplayDate, formatTimeLabel } from '@/features/home-dashboard/utils/calendar'

function getStatusVariant(status) {
  switch (status) {
    case 'scheduled':
      return 'default'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'secondary'
    default:
      return 'muted'
  }
}

function MeetingSummary({ meeting }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-medium">{meeting.title}</h3>
        <Badge variant={getStatusVariant(meeting.status)}>
          {meeting.status ?? 'scheduled'}
        </Badge>
      </div>

      <div className="grid gap-3 text-sm">
        <DetailItem label="Purpose" value={meeting.purpose || '—'} />
        <DetailItem
          label="Date & Time"
          value={`${formatDisplayDate(meeting.date ?? meeting.meetingDate)} · ${formatTimeLabel(meeting.startTime ?? meeting.time)} – ${formatTimeLabel(meeting.endTime)}`}
        />

        {(meeting.internalParticipants?.length > 0 || meeting.externalParticipants?.length > 0) && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Participants
            </p>
            {meeting.internalParticipants?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">Internal</p>
                <ul className="mt-1 space-y-1">
                  {meeting.internalParticipants.map((p) => (
                    <li key={p.id} className="flex items-center gap-1.5">
                      <Users className="size-3 text-muted-foreground" />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {meeting.externalParticipants?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">External</p>
                <ul className="mt-1 space-y-1">
                  {meeting.externalParticipants.map((p) => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MeetingOverviewView({ selectedDate, items, onCreateMeeting, onCreateTask }) {
  const meetings = items.filter((item) => item.type === 'meeting')
  const tasks = items.filter((item) => item.type === 'task')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="size-4" />
        <span>{formatDisplayDate(selectedDate)}</span>
      </div>

      {meetings.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Meetings ({meetings.length})
          </p>
          {meetings.map((meeting) => (
            <MeetingSummary key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No meetings scheduled for this date.</p>
      )}

      {tasks.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tasks ({tasks.length})
          </p>
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li key={task.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCreateMeeting}>
          Schedule Meeting
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCreateTask}>
          Add Task
        </Button>
      </div>
    </div>
  )
}
