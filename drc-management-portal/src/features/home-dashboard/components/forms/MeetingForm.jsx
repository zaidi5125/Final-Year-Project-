import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { REMINDER_OPTIONS } from '@/features/meetings/utils/meetingLabels'

const MEETING_STATUSES = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const EMPTY_FORM = {
  title: '',
  purpose: '',
  venue: '',
  duration: '',
  date: '',
  startTime: '',
  endTime: '',
  reminder: '',
  description: '',
  result: '',
  status: 'scheduled',
}

export default function MeetingForm({ selectedDate, onSuccess }) {
  const { addMeeting } = useMeetings()
  const [form, setForm] = useState({ ...EMPTY_FORM, date: selectedDate ?? '' })

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.date || !form.startTime || !form.endTime) return

    addMeeting({
      title: form.title.trim(),
      purpose: form.purpose.trim(),
      venue: form.venue.trim(),
      duration: form.duration.trim(),
      date: form.date,
      meetingDate: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      time: form.startTime,
      reminder: form.reminder,
      description: form.description.trim(),
      result: form.result.trim(),
      status: form.status,
    })

    setForm({ ...EMPTY_FORM, date: selectedDate ?? '' })
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Title" htmlFor="meeting-title" required>
        <Input
          id="meeting-title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Meeting title"
          required
        />
      </FormField>

      <FormField label="Purpose" htmlFor="meeting-purpose">
        <Input
          id="meeting-purpose"
          value={form.purpose}
          onChange={(e) => updateField('purpose', e.target.value)}
          placeholder="Meeting purpose"
        />
      </FormField>

      <FormField label="Venue" htmlFor="meeting-venue">
        <Input
          id="meeting-venue"
          value={form.venue}
          onChange={(e) => updateField('venue', e.target.value)}
          placeholder="Meeting venue"
        />
      </FormField>

      <FormField label="Duration" htmlFor="meeting-duration">
        <Input
          id="meeting-duration"
          value={form.duration}
          onChange={(e) => updateField('duration', e.target.value)}
          placeholder="e.g. 1 hour 30 minutes"
        />
      </FormField>

      <FormField label="Meeting Date" htmlFor="meeting-date" required>
        <Input
          id="meeting-date"
          type="date"
          value={form.date}
          onChange={(e) => updateField('date', e.target.value)}
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Start Time" htmlFor="meeting-start-time" required>
          <Input
            id="meeting-start-time"
            type="time"
            value={form.startTime}
            onChange={(e) => updateField('startTime', e.target.value)}
            required
          />
        </FormField>

        <FormField label="End Time" htmlFor="meeting-end-time" required>
          <Input
            id="meeting-end-time"
            type="time"
            value={form.endTime}
            onChange={(e) => updateField('endTime', e.target.value)}
            required
          />
        </FormField>
      </div>

      <FormField label="Reminder" htmlFor="meeting-reminder">
        <Select
          id="meeting-reminder"
          value={form.reminder}
          onChange={(e) => updateField('reminder', e.target.value)}
        >
          {REMINDER_OPTIONS.map((item) => (
            <option key={item.value || 'none'} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Description" htmlFor="meeting-description">
        <Textarea
          id="meeting-description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Meeting details and agenda"
          rows={3}
        />
      </FormField>

      <FormField label="Result" htmlFor="meeting-result">
        <Textarea
          id="meeting-result"
          value={form.result}
          onChange={(e) => updateField('result', e.target.value)}
          placeholder="Meeting outcome or result"
          rows={2}
        />
      </FormField>

      <FormField label="Status" htmlFor="meeting-status">
        <Select
          id="meeting-status"
          value={form.status}
          onChange={(e) => updateField('status', e.target.value)}
        >
          {MEETING_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormField>

      <Button type="submit" className="w-full">
        Save Meeting
      </Button>
    </form>
  )
}
