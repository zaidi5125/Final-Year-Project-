import { Plus, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, ModuleSubNav, PageHeader } from '@/components/shared'
import MeetingsTable from '@/features/meetings/components/MeetingsTable'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { useAuth } from '@/store/AuthContext'

const SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.MEETINGS, end: true },
  { label: 'Calendar', to: ROUTE_PATHS.MEETINGS_CALENDAR },
]
export default function MeetingsPage() {
  const { meetings } = useMeetings()
  const { hasRole } = useAuth()
  const canCreate = hasRole('Admin') || hasRole('Sub Admin')
  const isEmpty = meetings.length === 0
  return (
    <section aria-label="Meetings" className="flex flex-col gap-6">
      <PageHeader
        title="Meetings"
        description="Schedule and manage meetings across your organization."
        actions={
          canCreate ? (
            <Button asChild>
              <Link to={ROUTE_PATHS.MEETING_CREATE}>
                <Plus className="size-4" aria-hidden="true" />
                Schedule Meeting
              </Link>
            </Button>
          ) : null
        }
      />
      <ModuleSubNav items={SUB_NAV_ITEMS} />
      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isEmpty ? (
            <EmptyState
              icon={Calendar}
              title="No meetings yet"
              description="Schedule your first meeting to coordinate with your team."
              action={
                canCreate ? (
                  <Button asChild>
                    <Link to={ROUTE_PATHS.MEETING_CREATE}>
                      <Plus className="size-4" aria-hidden="true" />
                      Schedule Meeting
                    </Link>
                  </Button>
                ) : null
              }
            />
          ) : (
            <MeetingsTable meetings={meetings} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
