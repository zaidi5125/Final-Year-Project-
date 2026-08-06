export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
]

export const LEAD_TYPES = [
  { value: 'course', label: 'Course' },
  { value: 'dispute', label: 'Dispute' },
]

export function getStatusLabel(status) {
  return LEAD_STATUSES.find((item) => item.value === status)?.label ?? status
}

export function getStatusVariant(status) {
  switch (status) {
    case 'new':
      return 'default'
    case 'contacted':
      return 'warning'
    case 'in_progress':
      return 'secondary'
    case 'converted':
      return 'success'
    case 'closed':
      return 'muted'
    default:
      return 'muted'
  }
}

export function getTypeLabel(type) {
  return LEAD_TYPES.find((item) => item.value === type)?.label ?? type
}
