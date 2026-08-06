export const TEAM_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export function getStatusLabel(status) {
  return TEAM_STATUSES.find((item) => item.value === status)?.label ?? status
}

export function getStatusVariant(status) {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'muted'
    default:
      return 'muted'
  }
}
