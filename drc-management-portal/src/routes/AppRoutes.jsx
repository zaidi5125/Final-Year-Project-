import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import TrainingLayout from '@/layouts/TrainingLayout'
import { ROUTE_PATHS } from '@/routes/routePaths'
import ProtectedRoute from '@/routes/ProtectedRoute'
import RoleRoute from '@/routes/RoleRoute'
import HomePage from '@/pages/HomePage'
import TrainingPage from '@/pages/training/TrainingPage'
import CoursesPage from '@/pages/training/CoursesPage'
import CreateCoursePage from '@/pages/training/CreateCoursePage'
import EditCoursePage from '@/pages/training/EditCoursePage'
import CourseDetailsPage from '@/pages/training/CourseDetailsPage'
import ServicesPage from '@/pages/services/ServicesPage'
import CasesListPage from '@/pages/services/CasesListPage'
import AddCasePage from '@/pages/services/AddCasePage'
import EditCasePage from '@/pages/services/EditCasePage'
import CaseDetailsPage from '@/pages/services/CaseDetailsPage'
import ResearchesPage from '@/pages/researches/ResearchesPage'
import AddResearchPage from '@/pages/researches/AddResearchPage'
import EditResearchPage from '@/pages/researches/EditResearchPage'
import ResearchDetailsPage from '@/pages/researches/ResearchDetailsPage'
import ResearchDashboardPage from '@/pages/researches/ResearchDashboardPage'
import LeadsPage from '@/pages/leads/LeadsPage'
import LeadsListPage from '@/pages/leads/LeadsListPage'
import AddLeadPage from '@/pages/leads/AddLeadPage'
import EditLeadPage from '@/pages/leads/EditLeadPage'
import LeadDetailsPage from '@/pages/leads/LeadDetailsPage'
import LeadsBoardPage from '@/pages/leads/LeadsBoardPage'
import LeadsDashboardPage from '@/pages/leads/LeadsDashboardPage'
import CourseLeadsPage from '@/pages/leads/CourseLeadsPage'
import DisputeLeadsPage from '@/pages/leads/DisputeLeadsPage'
import TeamsPage from '@/pages/teams/TeamsPage'
import AddTeamPage from '@/pages/teams/AddTeamPage'
import EditTeamPage from '@/pages/teams/EditTeamPage'
import TeamDetailsPage from '@/pages/teams/TeamDetailsPage'
import MeetingsPage from '@/pages/meetings/MeetingsPage'
import AddMeetingPage from '@/pages/meetings/AddMeetingPage'
import EditMeetingPage from '@/pages/meetings/EditMeetingPage'
import MeetingDetailsPage from '@/pages/meetings/MeetingDetailsPage'
import MeetingsCalendarPage from '@/pages/meetings/MeetingsCalendarPage'
import TasksPage from '@/pages/tasks/TasksPage'
import CreateTaskPage from '@/pages/tasks/CreateTaskPage'
import EditTaskPage from '@/pages/tasks/EditTaskPage'
import TaskDetailsPage from '@/pages/tasks/TaskDetailsPage'
import MyTasksPage from '@/pages/tasks/MyTasksPage'
import ParticipantsPage from '@/pages/participants/ParticipantsPage'
import AddParticipantPage from '@/pages/participants/AddParticipantPage'
import EditParticipantPage from '@/pages/participants/EditParticipantPage'
import ParticipantDetailsPage from '@/pages/participants/ParticipantDetailsPage'
import NotificationsPage from '@/pages/notifications/NotificationsPage'
import NotificationDetailsPage from '@/pages/notifications/NotificationDetailsPage'
import NotificationLogsPage from '@/pages/notifications/NotificationLogsPage'
import NotificationPreferencesPage from '@/pages/notifications/NotificationPreferencesPage'
import LoginPage from '@/pages/auth/LoginPage'
import ChangePassword from '@/pages/ChangePassword'
import Unauthorized from '@/pages/Unauthorized'
import AdminDashboard from '@/pages/admin/Dashboard'
import SubadminDashboard from '@/pages/subadmin/Dashboard'
import StaffDashboard from '@/pages/staff/Dashboard'
import AdministratorPage from '@/pages/accounts/AdministratorPage'
import ManageUsersPage from '@/pages/accounts/ManageUsersPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
      <Route path={ROUTE_PATHS.CHANGE_PASSWORD} element={<ChangePassword />} />
      <Route path={ROUTE_PATHS.UNAUTHORIZED} element={<Unauthorized />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path={ROUTE_PATHS.ADMIN_DASHBOARD}
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.SUBADMIN_DASHBOARD}
            element={
              <RoleRoute allowedRoles={['Sub Admin']}>
                <SubadminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.STAFF_DASHBOARD}
            element={
              <RoleRoute excludeRoles={['Admin', 'Sub Admin']}>
                <StaffDashboard />
              </RoleRoute>
            }
          />

          <Route path={ROUTE_PATHS.TRAINING} element={<TrainingLayout />}>
            <Route index element={<TrainingPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/new" element={<CreateCoursePage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
            <Route path="courses/:id/edit" element={<EditCoursePage />} />
          </Route>

          <Route path={ROUTE_PATHS.SERVICES} element={<ServicesPage />} />
          <Route path={ROUTE_PATHS.CASES} element={<CasesListPage />} />
          <Route path={ROUTE_PATHS.CASE_CREATE} element={<AddCasePage />} />
          <Route path="/services/cases/:id" element={<CaseDetailsPage />} />
          <Route path="/services/cases/:id/edit" element={<EditCasePage />} />
          <Route path={ROUTE_PATHS.PARTY_MEMBERS} element={<Navigate to={ROUTE_PATHS.CASES} replace />} />
          <Route path={ROUTE_PATHS.PARTY_MEMBER_CREATE} element={<Navigate to={ROUTE_PATHS.CASE_CREATE} replace />} />
          <Route path="/services/party-members/:id" element={<Navigate to={ROUTE_PATHS.CASES} replace />} />
          <Route path="/services/party-members/:id/edit" element={<Navigate to={ROUTE_PATHS.CASES} replace />} />
          <Route path={ROUTE_PATHS.RESEARCHES} element={<ResearchesPage />} />
          <Route path={ROUTE_PATHS.RESEARCH_CREATE} element={<AddResearchPage />} />
          <Route path={ROUTE_PATHS.RESEARCH_DASHBOARD} element={<ResearchDashboardPage />} />
          <Route path="/researches/:id" element={<ResearchDetailsPage />} />
          <Route path="/researches/:id/edit" element={<EditResearchPage />} />
          <Route path={ROUTE_PATHS.LEADS} element={<LeadsPage />} />
          <Route path={ROUTE_PATHS.LEADS_LIST} element={<LeadsListPage />} />
          <Route path={ROUTE_PATHS.LEAD_CREATE} element={<AddLeadPage />} />
          <Route path={ROUTE_PATHS.LEADS_BOARD} element={<LeadsBoardPage />} />
          <Route path={ROUTE_PATHS.LEADS_DASHBOARD} element={<LeadsDashboardPage />} />
          <Route path={ROUTE_PATHS.COURSE_LEADS} element={<CourseLeadsPage />} />
          <Route path={ROUTE_PATHS.DISPUTE_LEADS} element={<DisputeLeadsPage />} />
          <Route path="/leads/:id/edit" element={<EditLeadPage />} />
          <Route path="/leads/:id" element={<LeadDetailsPage />} />
          <Route path={ROUTE_PATHS.TEAMS} element={<TeamsPage />} />
          <Route path={ROUTE_PATHS.TEAM_CREATE} element={<AddTeamPage />} />
          <Route path="/teams/:id" element={<TeamDetailsPage />} />
          <Route path="/teams/:id/edit" element={<EditTeamPage />} />
          <Route path={ROUTE_PATHS.MEETINGS} element={<MeetingsPage />} />
          <Route path={ROUTE_PATHS.MEETING_CREATE} element={<AddMeetingPage />} />
          <Route path={ROUTE_PATHS.MEETINGS_CALENDAR} element={<MeetingsCalendarPage />} />
          <Route path="/meetings/:id/edit" element={<EditMeetingPage />} />
          <Route path="/meetings/:id" element={<MeetingDetailsPage />} />
          <Route path={ROUTE_PATHS.TASKS} element={<TasksPage />} />
          <Route path={ROUTE_PATHS.TASK_CREATE} element={<CreateTaskPage />} />
          <Route path={ROUTE_PATHS.TASKS_KANBAN} element={<Navigate to={ROUTE_PATHS.TASKS} replace />} />
          <Route path={ROUTE_PATHS.TASKS_CALENDAR} element={<Navigate to={ROUTE_PATHS.TASKS} replace />} />
          <Route path={ROUTE_PATHS.TASKS_MY} element={<MyTasksPage />} />
          <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path={ROUTE_PATHS.PARTICIPANTS} element={<ParticipantsPage />} />
          <Route path={ROUTE_PATHS.PARTICIPANT_CREATE} element={<AddParticipantPage />} />
          <Route path="/participants/:id/edit" element={<EditParticipantPage />} />
          <Route path="/participants/:id" element={<ParticipantDetailsPage />} />
          <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTE_PATHS.NOTIFICATION_SEND} element={<Navigate to={ROUTE_PATHS.NOTIFICATIONS} replace />} />
          <Route path={ROUTE_PATHS.NOTIFICATION_LOGS} element={<NotificationLogsPage />} />
          <Route path={ROUTE_PATHS.NOTIFICATION_PREFERENCES} element={<NotificationPreferencesPage />} />
          <Route path="/notifications/:id" element={<NotificationDetailsPage />} />
          <Route
            path={ROUTE_PATHS.USER_SETTINGS}
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <AdministratorPage />
              </RoleRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.MANAGE_USERS}
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <ManageUsersPage />
              </RoleRoute>
            }
          />
          <Route path="*" element={<Navigate to={ROUTE_PATHS.HOME} replace />} />
        </Route>
      </Route>
    </Routes>
  )
}





