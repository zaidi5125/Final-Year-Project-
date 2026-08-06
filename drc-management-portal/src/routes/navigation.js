import {
  Bell, BookOpen, Briefcase, Calendar, CheckSquare, FileText, GraduationCap,
  Home, Microscope, Scale, Target, Users, UserCog, UsersRound,
} from 'lucide-react'
import { ROUTE_PATHS } from '@/routes/routePaths'

export const NAVIGATION_ITEMS = [
  { label: 'Home', path: ROUTE_PATHS.HOME, icon: Home },
  {
    label: 'Training', path: ROUTE_PATHS.TRAINING, icon: GraduationCap,
    allowedRoles: ['Admin', 'Sub Admin'],
    children: [
      { label: 'Courses', path: ROUTE_PATHS.COURSES, icon: BookOpen },
    ],
  },
  {
    label: 'Services', path: ROUTE_PATHS.SERVICES, icon: Briefcase,
    children: [
      { label: 'Cases', path: ROUTE_PATHS.CASES, icon: Scale },
    ],
  },
  { label: 'Researches', path: ROUTE_PATHS.RESEARCHES, icon: Microscope },
  {
    label: 'Leads', path: ROUTE_PATHS.LEADS, icon: Target,
    allowedRoles: ['Admin', 'Sub Admin'],
    children: [
      { label: 'Course Leads', path: ROUTE_PATHS.COURSE_LEADS, icon: GraduationCap },
      { label: 'Dispute Leads', path: ROUTE_PATHS.DISPUTE_LEADS, icon: FileText },
    ],
  },
  { label: 'Teams', path: ROUTE_PATHS.TEAMS, icon: Users, allowedRoles: ['Admin', 'Sub Admin'] },
  { label: 'Meetings', path: ROUTE_PATHS.MEETINGS, icon: Calendar },
  { label: 'Tasks', path: ROUTE_PATHS.TASKS, icon: CheckSquare },
  { label: 'Participants', path: ROUTE_PATHS.PARTICIPANTS, icon: UsersRound, allowedRoles: ['Admin', 'Sub Admin'] },
  { label: 'Notifications', path: ROUTE_PATHS.NOTIFICATIONS, icon: Bell },
  { label: 'Manage Users', path: ROUTE_PATHS.MANAGE_USERS, icon: UserCog, allowedRoles: ['Admin'] },
]
