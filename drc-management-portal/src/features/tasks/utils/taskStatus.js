export const TASK_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
]

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const TASK_VISIBILITIES = [
  { value: 'private', label: 'Private' },
  { value: 'shared', label: 'Shared' },
]

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

export function getStatusLabel(status) {
  return TASK_STATUSES.find((item) => item.value === status)?.label ?? status
}

export function getStatusVariant(status) {
  switch (status) {
    case 'pending':
      return 'muted'
    case 'in_progress':
      return 'warning'
    case 'completed':
      return 'success'
    case 'overdue':
      return 'destructive'
    default:
      return 'muted'
  }
}

export function getPriorityLabel(priority) {
  return TASK_PRIORITIES.find((item) => item.value === priority)?.label ?? priority
}

export function getPriorityVariant(priority) {
  switch (priority) {
    case 'low':
      return 'muted'
    case 'medium':
      return 'secondary'
    case 'high':
      return 'destructive'
    default:
      return 'muted'
  }
}

export function getVisibilityLabel(visibility) {
  return TASK_VISIBILITIES.find((item) => item.value === visibility)?.label ?? visibility
}

export function validateTaskDates(startDate, dueDate) {
  if (!startDate || !dueDate) return true
  return dueDate >= startDate
}

export function resolveTaskStatus(task) {
  if (!task || task.isDeleted || task.is_deleted) return task?.status
  if (task.status === 'completed') return 'completed'
  const dueDate = task.dueDate ?? task.endDate
  if (dueDate) {
    const today = new Date().toISOString().slice(0, 10)
    if (dueDate < today && task.status !== 'completed') return 'overdue'
  }
  return task.status
}

export function isTaskVisibleToUser(task, userId) {
  if (!task || task.isDeleted) return false
  if (task.visibility === 'shared') {
    const isAssigned = (task.assignedUsers ?? []).some((a) => a.userId === userId)
    return task.createdBy === userId || isAssigned
  }
  return task.createdBy === userId
}

export function isTaskPending(task) {
  const status = resolveTaskStatus(task)
  return status === 'pending' || status === 'in_progress' || status === 'overdue'
}

export function isTaskDueToday(task) {
  const today = new Date().toISOString().slice(0, 10)
  const dueDate = task.dueDate ?? task.endDate
  return dueDate === today || task.startDate === today
}

export function getTaskDueDate(task) {
  return task.dueDate ?? task.endDate ?? ''
}

export function getAssignedUserNames(task) {
  if (task.assignedUsers?.length) {
    return task.assignedUsers.map((a) => a.userName).join(', ')
  }
  return task.assignedToName || task.assignedTo || ''
}
