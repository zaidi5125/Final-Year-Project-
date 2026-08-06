export const ROUTE_PATHS = {
  LOGIN: '/login',
  CHANGE_PASSWORD: '/change-password',
  UNAUTHORIZED: '/unauthorized',
  ADMIN_DASHBOARD: '/admin/dashboard',
  SUBADMIN_DASHBOARD: '/subadmin/dashboard',
  STAFF_DASHBOARD: '/staff/dashboard',
  USER_SETTINGS: '/accounts/user-settings',
  MANAGE_USERS: '/accounts/manage-users',
  HOME: '/',
  TRAINING: '/training',
  COURSES: '/training/courses',
  COURSE_CREATE: '/training/courses/new',
  FOUNDATIONAL_TRAINING: '/training/foundational',
  SERVICES: '/services',
  CASES: '/services/cases',
  CASE_CREATE: '/services/cases/new',
  PARTY_MEMBERS: '/services/party-members',
  PARTY_MEMBER_CREATE: '/services/party-members/new',
  RESEARCHES: '/researches',
  RESEARCH_CREATE: '/researches/new',
  RESEARCH_DASHBOARD: '/researches/dashboard',
  LEADS: '/leads',
  LEADS_LIST: '/leads/list',
  LEAD_CREATE: '/leads/new',
  LEADS_BOARD: '/leads/board',
  LEADS_DASHBOARD: '/leads/dashboard',
  COURSE_LEADS: '/leads/course',
  DISPUTE_LEADS: '/leads/dispute',
  TEAMS: '/teams',
  TEAM_CREATE: '/teams/new',
  MEETINGS: '/meetings',
  MEETING_CREATE: '/meetings/new',
  MEETINGS_CALENDAR: '/meetings/calendar',
  TASKS: '/tasks',
  TASK_CREATE: '/tasks/new',
  TASKS_KANBAN: '/tasks/kanban',
  TASKS_CALENDAR: '/tasks/calendar',
  TASKS_MY: '/tasks/my',
  PARTICIPANTS: '/participants',
  PARTICIPANT_CREATE: '/participants/new',
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_SEND: '/notifications/send',
  NOTIFICATION_LOGS: '/notifications/logs',
  NOTIFICATION_PREFERENCES: '/notifications/preferences',
}

export function courseDetailsPath(id) { return `/training/courses/${id}` }
export function courseEditPath(id) { return `/training/courses/${id}/edit` }
export function caseDetailsPath(id) { return `/services/cases/${id}` }
export function caseEditPath(id) { return `/services/cases/${id}/edit` }
export function partyMemberDetailsPath(id) { return `/services/party-members/${id}` }
export function partyMemberEditPath(id) { return `/services/party-members/${id}/edit` }
export function researchDetailsPath(id) { return `/researches/${id}` }
export function researchEditPath(id) { return `/researches/${id}/edit` }
export function leadDetailsPath(id) { return `/leads/${id}` }
export function leadEditPath(id) { return `/leads/${id}/edit` }
export function teamDetailsPath(id) { return `/teams/${id}` }
export function teamEditPath(id) { return `/teams/${id}/edit` }
export function meetingDetailsPath(id) { return `/meetings/${id}` }
export function meetingEditPath(id) { return `/meetings/${id}/edit` }
export function taskDetailsPath(id) { return `/tasks/${id}` }
export function taskEditPath(id) { return `/tasks/${id}/edit` }
export function participantDetailsPath(id) { return `/participants/${id}` }
export function participantEditPath(id) { return `/participants/${id}/edit` }
export function notificationDetailsPath(id) { return `/notifications/${id}` }
