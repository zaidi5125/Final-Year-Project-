import { Link } from 'react-router-dom'
import {
  Briefcase,
  CheckSquare,
  GraduationCap,
  Target,
  Users,
  UsersRound,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import { ROUTE_PATHS } from '@/routes/routePaths'

const STAT_CARDS = [
  { label: 'Courses', value: '12', icon: GraduationCap, to: ROUTE_PATHS.COURSES },
  { label: 'Cases', value: '28', icon: Briefcase, to: ROUTE_PATHS.CASES },
  { label: 'Leads', value: '45', icon: Target, to: ROUTE_PATHS.LEADS },
  { label: 'Tasks', value: '19', icon: CheckSquare, to: ROUTE_PATHS.TASKS },
  { label: 'Teams', value: '8', icon: Users, to: ROUTE_PATHS.TEAMS },
  { label: 'Participants', value: '64', icon: UsersRound, to: ROUTE_PATHS.PARTICIPANTS },
]

const RECENT_ACTIVITY = [
  { id: 1, title: 'New course created', detail: 'Mediation Basics', status: 'Completed' },
  { id: 2, title: 'Case updated', detail: 'CASE-1042', status: 'In Progress' },
  { id: 3, title: 'Lead assigned', detail: 'Course Lead - Ali', status: 'Pending' },
  { id: 4, title: 'Team member added', detail: 'Dispute Resolution Team', status: 'Completed' },
]

function getStatusVariant(status) {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'In Progress':
      return 'warning'
    case 'Pending':
      return 'secondary'
    default:
      return 'muted'
  }
}

export default function AdminDashboard() {
  return (
    <section aria-label="Admin Dashboard" className="flex flex-col gap-6">
      <PageHeader
        title="Admin Dashboard"
        description="Full system overview and quick access to all modules."
        actions={
          <Button variant="outline" asChild>
            <Link to={ROUTE_PATHS.USER_SETTINGS}>User Settings</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_CARDS.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.label} to={item.to} className="block">
              <Card className="transition-shadow hover:shadow-soft-lg">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {RECENT_ACTIVITY.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
