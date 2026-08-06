const MEETING_TYPE_LABELS = {
  internal: 'Internal',
  client: 'Client',
  team: 'Team',
  review: 'Review',
}

const REMINDER_LABELS = {
  '15min': '15 minutes before',
  '30min': '30 minutes before',
  '1hour': '1 hour before',
  '1day': '1 day before',
}

export function getMeetingTypeLabel(type) {
  return MEETING_TYPE_LABELS[type] ?? type ?? '—'
}

export function getReminderLabel(reminder) {
  return REMINDER_LABELS[reminder] ?? (reminder || 'No reminder')
}

export const MEETING_TYPES = [
  { value: 'internal', label: 'Internal' },
  { value: 'client', label: 'Client' },
  { value: 'team', label: 'Team' },
  { value: 'review', label: 'Review' },
]

export const REMINDER_OPTIONS = [
  { value: '', label: 'No reminder' },
  { value: '15min', label: '15 minutes before' },
  { value: '30min', label: '30 minutes before' },
  { value: '1hour', label: '1 hour before' },
  { value: '1day', label: '1 day before' },
]
