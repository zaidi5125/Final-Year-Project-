import { BookOpen, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, PageHeader } from '@/components/shared'
import CoursesTable from '@/features/training/components/courses/CoursesTable'
import { useTraining } from '@/features/training/context/TrainingContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function CoursesPage() {
  const { courses } = useTraining()
  const isEmpty = courses.length === 0

  return (
    <section aria-label="Courses" className="flex flex-col gap-6">
      <PageHeader
        title="Courses"
        description="Create and manage training courses."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.COURSE_CREATE}>
              <Plus className="size-4" aria-hidden="true" />
              Create Course
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isEmpty ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Create your first course to get started with training management."
              action={
                <Button asChild>
                  <Link to={ROUTE_PATHS.COURSE_CREATE}>
                    <Plus className="size-4" aria-hidden="true" />
                    Create Course
                  </Link>
                </Button>
              }
            />
          ) : (
            <CoursesTable courses={courses} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
