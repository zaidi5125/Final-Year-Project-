export const PARTICIPANT_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'completed', label: 'Completed' },
]

export const PARTICIPANT_GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export function getStatusLabel(status) {
  return PARTICIPANT_STATUSES.find((item) => item.value === status)?.label ?? status
}

export function getStatusVariant(status) {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'muted'
    case 'completed':
      return 'secondary'
    default:
      return 'muted'
  }
}

export function getGenderLabel(gender) {
  return PARTICIPANT_GENDERS.find((item) => item.value === gender)?.label ?? gender
}

export function getParticipantDisplayName(participant) {
  return participant?.fullName ?? participant?.name ?? '—'
}

export function generateParticipantId(existingCount) {
  const num = String(existingCount + 1).padStart(3, '0')
  return `PRT-${num}`
}
