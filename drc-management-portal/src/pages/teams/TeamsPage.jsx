import { Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, PageHeader } from '@/components/shared'
import TeamsTable from '@/features/teams/components/TeamsTable'
import { useTeams } from '@/features/teams/context/TeamsContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function TeamsPage() {
  const { teams } = useTeams()
  const isEmpty = teams.length === 0

  return (
    <section aria-label="Teams" className="flex flex-col gap-6">
      <PageHeader
        title="Teams"
        description="Create and manage organizational teams."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.TEAM_CREATE}>
              <Plus className="size-4" aria-hidden="true" />
              Create Team
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isEmpty ? (
            <EmptyState
              icon={Users}
              title="No teams yet"
              description="Create your first team to organize members and workflows."
              action={
                <Button asChild>
                  <Link to={ROUTE_PATHS.TEAM_CREATE}>
                    <Plus className="size-4" aria-hidden="true" />
                    Create Team
                  </Link>
                </Button>
              }
            />
          ) : (
            <TeamsTable teams={teams} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
