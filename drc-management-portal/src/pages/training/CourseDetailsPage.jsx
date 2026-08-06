import { Pencil } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared'
import FilesTab from '@/features/training/components/course-details/FilesTab'
import MembersTab from '@/features/training/components/course-details/MembersTab'
import OverviewTab from '@/features/training/components/course-details/OverviewTab'
import CourseStatusBadge from '@/features/training/components/CourseStatusBadge'
import { useTraining } from '@/features/training/context/TrainingContext'
import { courseEditPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function CourseDetailsPage() {
  const { id } = useParams()
  const { getCourseById } = useTraining()
  const course = getCourseById(id)

  if (!course) {
    return (
      <section aria-label="Course Details" className="flex flex-col gap-6">
        <PageHeader
          title="Course Not Found"
          description="The course you are looking for does not exist."
          backTo={ROUTE_PATHS.COURSES}
          backLabel="Back to Courses"
        />
      </section>
    )
  }

  return (
    <section aria-label="Course Details" className="flex flex-col gap-6">
      <PageHeader
        title={course.courseName}
        description={`Course ID: ${course.courseId}`}
        backTo={ROUTE_PATHS.COURSES}
        backLabel="Back to Courses"
        actions={
          <>
            <CourseStatusBadge status={course.status} />
            <Button variant="outline" asChild>
              <Link to={courseEditPath(id)}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit Course
              </Link>
            </Button>
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab course={course} />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab course={course} />
        </TabsContent>

        <TabsContent value="files">
          <FilesTab files={course.files} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
