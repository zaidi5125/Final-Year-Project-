export const RESEARCH_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export const RESEARCHER_LEVELS = [
  { value: 'senior', label: 'Senior Researcher' },
  { value: 'junior', label: 'Junior Researcher' },
  { value: 'assistant', label: 'Research Assistant' },
]

export function getStatusLabel(status) {
  return RESEARCH_STATUSES.find((item) => item.value === status)?.label ?? status
}

export function getStatusVariant(status) {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'in_progress':
      return 'default'
    case 'completed':
      return 'success'
    default:
      return 'muted'
  }
}

export function getResearcherLevelLabel(level) {
  return RESEARCHER_LEVELS.find((item) => item.value === level)?.label ?? level
}
