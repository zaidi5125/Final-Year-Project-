import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumb, DetailItem, PageHeader, SectionCard } from '@/components/shared'
import {
  ExternalParticipantsTable,
  InternalParticipantsTable,
} from '@/features/meetings/components/MeetingParticipantsTables'
import ParticipantModal from '@/features/meetings/components/ParticipantModal'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { getMeetingTypeLabel, getReminderLabel } from '@/features/meetings/utils/meetingLabels'
import { formatDisplayDate, formatTimeLabel } from '@/features/home-dashboard/utils/calendar'
import { meetingEditPath, ROUTE_PATHS } from '@/routes/routePaths'
import { showSuccess } from '@/utils/toast'

export default function MeetingDetailsPage() {
  const { id } = useParams()
  const { getMeetingById, updateMeeting } = useMeetings()
  const meeting = getMeetingById(id)
  const [modalState, setModalState] = useState(null)

  if (!meeting) {
    return (
      <section aria-label="Meeting Details" className="flex flex-col gap-6">
        <PageHeader title="Meeting Not Found" backTo={ROUTE_PATHS.MEETINGS} backLabel="Back to Meetings" />
      </section>
    )
  }

  const internalParticipants = meeting.internalParticipants ?? []
  const externalParticipants = meeting.externalParticipants ?? []
  const existingInternalIds = internalParticipants.map((p) => p.teamMemberId).filter(Boolean)

  const openModal = (type, editData = null) => setModalState({ type, editData })
  const closeModal = () => setModalState(null)

  const handleAdd = (participant) => {
    if (participant.type === 'internal') {
      updateMeeting(id, { internalParticipants: [...internalParticipants, participant] })
      showSuccess(`${participant.name} added as internal participant.`)
    } else {
      updateMeeting(id, { externalParticipants: [...externalParticipants, participant] })
      showSuccess(`${participant.fullName || participant.name} added as external participant.`)
    }
  }

  const handleEdit = (participant) => {
    if (participant.type === 'internal') {
      updateMeeting(id, {
        internalParticipants: internalParticipants.map((p) =>
          p.id === participant.id ? participant : p,
        ),
      })
      showSuccess('Internal participant updated.')
    } else {
      updateMeeting(id, {
        externalParticipants: externalParticipants.map((p) =>
          p.id === participant.id ? participant : p,
        ),
      })
      showSuccess('External participant updated.')
    }
  }

  const handleDeleteInternal = (participantId) => {
    updateMeeting(id, {
      internalParticipants: internalParticipants.filter((p) => p.id !== participantId),
    })
    showSuccess('Internal participant removed.')
  }

  const handleDeleteExternal = (participantId) => {
    updateMeeting(id, {
      externalParticipants: externalParticipants.filter((p) => p.id !== participantId),
    })
    showSuccess('External participant removed.')
  }

  return (
    <section aria-label="Meeting Details" className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Meetings', to: ROUTE_PATHS.MEETINGS },
          { label: meeting.title },
        ]}
      />

      <PageHeader
        title={meeting.title}
        description={formatDisplayDate(meeting.date)}
        backTo={ROUTE_PATHS.MEETINGS}
        backLabel="Back to Meetings"
        actions={
          <Button variant="outline" asChild>
            <Link to={meetingEditPath(id)}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit Meeting
            </Link>
          </Button>
        }
      />

      <SectionCard title="Overview">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Date" value={formatDisplayDate(meeting.date)} />
          <DetailItem label="Time" value={meeting.time ? formatTimeLabel(meeting.time) : '—'} />
          <DetailItem label="Type" value={getMeetingTypeLabel(meeting.meetingType)} />
          <DetailItem label="Reminder" value={getReminderLabel(meeting.reminder)} />
          <div className="sm:col-span-2">
            <DetailItem label="Description" value={meeting.description || 'No description provided.'} />
          </div>
        </div>
      </SectionCard>

      <InternalParticipantsTable
        participants={internalParticipants}
        onAdd={() => openModal('internal')}
        onEdit={(p) => openModal('internal', p)}
        onDelete={handleDeleteInternal}
      />

      <ExternalParticipantsTable
        participants={externalParticipants}
        onAdd={() => openModal('external')}
        onEdit={(p) => openModal('external', p)}
        onDelete={handleDeleteExternal}
      />

      <ParticipantModal
        open={modalState !== null}
        onClose={closeModal}
        type={modalState?.type ?? 'internal'}
        editData={modalState?.editData}
        existingInternalIds={existingInternalIds}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />
    </section>
  )
}
