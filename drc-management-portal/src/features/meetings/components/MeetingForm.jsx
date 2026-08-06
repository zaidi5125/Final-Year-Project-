import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared'
import ParticipantModal from '@/features/meetings/components/ParticipantModal'
import { MEETING_TYPES, REMINDER_OPTIONS } from '@/features/meetings/utils/meetingLabels'

const EMPTY_VALUES = {
  title: '',
  date: '',
  time: '',
  participants: '',
  meetingType: '',
  description: '',
  reminder: '',
  internalParticipants: [],
  externalParticipants: [],
}

function ParticipantList({ participants, onRemove }) {
  if (participants.length === 0) {
    return <p className="text-sm text-muted-foreground">No participants added yet.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {participants.map((participant) => (
        <li
          key={participant.id}
          className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
        >
          <div>
            <p className="font-medium">{participant.name}</p>
            <p className="text-xs text-muted-foreground">{participant.email}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(participant.id)}
            aria-label={`Remove ${participant.name}`}
          >
            <X className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}

export default function MeetingForm({
  initialValues = EMPTY_VALUES,
  submitLabel = 'Save Meeting',
  onSubmit,
  onCancel,
}) {
  const [internalParticipants, setInternalParticipants] = useState(
    initialValues.internalParticipants ?? [],
  )
  const [externalParticipants, setExternalParticipants] = useState(
    initialValues.externalParticipants ?? [],
  )
  const [participantModal, setParticipantModal] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
      title: formData.get('title')?.toString().trim() ?? '',
      date: formData.get('date')?.toString() ?? '',
      time: formData.get('time')?.toString() ?? '',
      participants: formData.get('participants')?.toString().trim() ?? '',
      meetingType: formData.get('meetingType')?.toString() ?? '',
      description: formData.get('description')?.toString().trim() ?? '',
      reminder: formData.get('reminder')?.toString() ?? '',
      internalParticipants,
      externalParticipants,
    }

    if (!data.title || !data.date) return

    onSubmit(data)
  }

  const handleAddParticipant = (participant) => {
    if (participant.type === 'internal') {
      setInternalParticipants((prev) => [...prev, participant])
    } else {
      setExternalParticipants((prev) => [...prev, participant])
    }
  }

  const handleRemoveInternal = (id) => {
    setInternalParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  const handleRemoveExternal = (id) => {
    setExternalParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" required className="sm:col-span-2">
            <Input
              id="title"
              name="title"
              defaultValue={initialValues.title}
              placeholder="Meeting title"
              required
            />
          </FormField>

          <FormField label="Date" htmlFor="date" required>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={initialValues.date}
              required
            />
          </FormField>

          <FormField label="Time" htmlFor="time">
            <Input
              id="time"
              name="time"
              type="time"
              defaultValue={initialValues.time}
            />
          </FormField>

          <FormField label="Participants" htmlFor="participants" className="sm:col-span-2">
            <Input
              id="participants"
              name="participants"
              defaultValue={initialValues.participants}
              placeholder="General participants note"
            />
          </FormField>

          <FormField label="Meeting Type" htmlFor="meetingType">
            <Select id="meetingType" name="meetingType" defaultValue={initialValues.meetingType}>
              <option value="">Select type</option>
              {MEETING_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Reminder" htmlFor="reminder">
            <Select id="reminder" name="reminder" defaultValue={initialValues.reminder}>
              {REMINDER_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Description" htmlFor="description" className="sm:col-span-2">
            <Textarea
              id="description"
              name="description"
              defaultValue={initialValues.description}
              placeholder="Meeting details and agenda"
              rows={4}
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Internal Participants</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setParticipantModal('internal')}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add
              </Button>
            </div>
            <ParticipantList participants={internalParticipants} onRemove={handleRemoveInternal} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">External Participants</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setParticipantModal('external')}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add
              </Button>
            </div>
            <ParticipantList participants={externalParticipants} onRemove={handleRemoveExternal} />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-4">
          <Button type="submit">{submitLabel}</Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <ParticipantModal
        open={participantModal !== null}
        onClose={() => setParticipantModal(null)}
        type={participantModal ?? 'internal'}
        onAdd={handleAddParticipant}
      />
    </>
  )
}
