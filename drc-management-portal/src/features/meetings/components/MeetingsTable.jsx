import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/shared'
import { getMeetingTypeLabel } from '@/features/meetings/utils/meetingLabels'
import { formatDisplayDate, formatTimeLabel } from '@/features/home-dashboard/utils/calendar'
import { meetingDetailsPath } from '@/routes/routePaths'

const columns = [
  {
    key: 'title',
    header: 'Title',
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: 'date',
    header: 'Date',
    render: (row) => formatDisplayDate(row.date),
  },
  {
    key: 'time',
    header: 'Time',
    render: (row) => (row.time ? formatTimeLabel(row.time) : '—'),
  },
  {
    key: 'meetingType',
    header: 'Type',
    render: (row) => getMeetingTypeLabel(row.meetingType),
  },
  {
    key: 'participants',
    header: 'Participants',
    render: (row) => {
      const count =
        (row.internalParticipants?.length ?? 0) + (row.externalParticipants?.length ?? 0)
      if (count > 0) return count
      return row.participants || '—'
    },
  },
]

export default function MeetingsTable({ meetings }) {
  const navigate = useNavigate()

  const sortedMeetings = useMemo(
    () =>
      [...meetings].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date)
        if (dateCompare !== 0) return dateCompare
        return (b.time ?? '').localeCompare(a.time ?? '')
      }),
    [meetings],
  )

  return (
    <DataTable
      columns={columns}
      data={sortedMeetings}
      onRowClick={(meeting) => navigate(meetingDetailsPath(meeting.id))}
    />
  )
}
