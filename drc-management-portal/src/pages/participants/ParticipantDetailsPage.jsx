import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DetailItem, PageHeader, SectionCard } from '@/components/shared'
import ParticipantStatusBadge from '@/features/participants/components/ParticipantStatusBadge'
import { useParticipants } from '@/features/participants/context/ParticipantsContext'
import {
  getGenderLabel,
  getParticipantDisplayName,
} from '@/features/participants/utils/participantFields'
import { participantEditPath, ROUTE_PATHS } from '@/routes/routePaths'
import { formatDate, formatDateTime } from '@/utils/formatDate'

export default function ParticipantDetailsPage() {
  const { id } = useParams()
  const { getParticipantById } = useParticipants()
  const participant = getParticipantById(id)

  if (!participant) {
    return (
      <section aria-label="Participant Details" className="flex flex-col gap-6">
        <PageHeader
          title="Participant Not Found"
          description="The participant you are looking for does not exist."
          backTo={ROUTE_PATHS.PARTICIPANTS}
          backLabel="Back to Participants"
        />
      </section>
    )
  }

  const displayName = getParticipantDisplayName(participant)

  return (
    <section aria-label="Participant Details" className="flex flex-col gap-6">
      <PageHeader
        title={displayName}
        description={participant.email}
        backTo={ROUTE_PATHS.PARTICIPANTS}
        backLabel="Back to Participants"
        actions={
          <Button variant="outline" asChild>
            <Link to={participantEditPath(id)}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit Participant
            </Link>
          </Button>
        }
      />

      <SectionCard title="Participant Detail">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Participant ID" value={participant.participantId || '—'} />

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Profile Image
            </p>
            {participant.profileImage ? (
              <img
                src={participant.profileImage}
                alt={displayName}
                className="size-20 rounded-full border border-border object-cover"
              />
            ) : (
              <p className="text-sm text-foreground">—</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <ParticipantStatusBadge status={participant.status} />
          </div>

          <DetailItem
            label="Enrolled Date"
            value={participant.enrolledDate ? formatDate(participant.enrolledDate) : '—'}
          />
          <DetailItem label="Session Year" value={participant.sessionYear || '—'} />
          <DetailItem label="Full Name" value={displayName} />
          <DetailItem label="Father Name" value={participant.fatherName || '—'} />
          <DetailItem
            label="Contact Number"
            value={participant.contactNumber || participant.phone || '—'}
          />
          <DetailItem label="Email" value={participant.email || '—'} />
          <DetailItem label="CNIC" value={participant.cnic || '—'} />
          <DetailItem label="City" value={participant.city || '—'} />
          <DetailItem label="Address" value={participant.address || '—'} />
          <DetailItem label="Gender" value={getGenderLabel(participant.gender)} />
          <DetailItem
            label="Created At"
            value={
              participant.createdAt
                ? `${formatDateTime(participant.createdAt)} (${participant.createdByName || '—'})`
                : '—'
            }
          />
          <DetailItem
            label="Updated At"
            value={
              participant.updatedAt
                ? `${formatDateTime(participant.updatedAt)} (${participant.updatedByName || '—'})`
                : '—'
            }
          />
        </div>
      </SectionCard>
    </section>
  )
}
