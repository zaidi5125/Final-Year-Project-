import { Microscope, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, ModuleSubNav, PageHeader } from '@/components/shared'
import ResearchesTable from '@/features/researches/components/ResearchesTable'
import { useResearches } from '@/features/researches/context/ResearchesContext'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { useAuth } from '@/store/AuthContext'

const subNavItems = [
  { label: 'List', to: ROUTE_PATHS.RESEARCHES, end: true },
  { label: 'Dashboard', to: ROUTE_PATHS.RESEARCH_DASHBOARD },
]
export default function ResearchesPage() {
  const { researches } = useResearches()
  const { hasRole } = useAuth()
  const canCreate = hasRole('Admin') || hasRole('Sub Admin')
  const isEmpty = researches.length === 0
  return (
    <section aria-label="Researches" className="flex flex-col gap-6">
      <PageHeader
        title="Researches"
        description="Create and manage research projects."
        actions={
          canCreate ? (
            <Button asChild>
              <Link to={ROUTE_PATHS.RESEARCH_CREATE}>
                <Plus className="size-4" aria-hidden="true" />
                Create Research
              </Link>
            </Button>
          ) : null
        }
      />
      <ModuleSubNav items={subNavItems} />
      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isEmpty ? (
            <EmptyState
              icon={Microscope}
              title="No researches yet"
              description="Create your first research project to get started."
              action={
                canCreate ? (
                  <Button asChild>
                    <Link to={ROUTE_PATHS.RESEARCH_CREATE}>
                      <Plus className="size-4" aria-hidden="true" />
                      Create Research
                    </Link>
                  </Button>
                ) : null
              }
            />
          ) : (
            <ResearchesTable researches={researches} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
