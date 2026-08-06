import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import CourseForm from '@/features/training/components/CourseForm'
import { useTraining } from '@/features/training/context/TrainingContext'
import { courseDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const { addCourse } = useTraining()

  const handleSubmit = async (data) => {
    const course = await addCourse(data)
    if (!course) return
    navigate(courseDetailsPath(course.id))
  }

  const handleCancel = () => {
    navigate(ROUTE_PATHS.COURSES)
  }

  return (
    <section aria-label="Create Course" className="flex flex-col gap-6">
      <PageHeader
        title="Create Course"
        description="Add a new training course to the system."
        backTo={ROUTE_PATHS.COURSES}
        backLabel="Back to Courses"
      />
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm
            submitLabel="Create Course"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
