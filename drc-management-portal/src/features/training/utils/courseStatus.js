export const COURSE_STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
]

export function getStatusLabel(status) {
  return COURSE_STATUSES.find((item) => item.value === status)?.label ?? status
}

export function getStatusVariant(status) {
  switch (status) {
    case 'upcoming':
      return 'warning'
    case 'ongoing':
      return 'default'
    case 'completed':
      return 'success'
    default:
      return 'muted'
  }
}
