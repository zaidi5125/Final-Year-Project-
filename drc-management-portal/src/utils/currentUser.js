export const CURRENT_USER = {
  id: 'user-admin-1',
  username: 'admin',
  fullName: 'System Admin',
}

export function getCurrentUser() {
  return CURRENT_USER
}

export function getAuditFields() {
  const user = getCurrentUser()
  const now = new Date().toISOString()
  return {
    createdBy: user.id,
    createdByName: user.fullName,
    updatedBy: user.id,
    updatedByName: user.fullName,
    createdAt: now,
    updatedAt: now,
  }
}
