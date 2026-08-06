import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared'
import CourseForm from '@/features/training/components/CourseForm'
import { useTraining } from '@/features/training/context/TrainingContext'
import { courseDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function EditCoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourseById, updateCourse } = useTraining()
  const course = getCourseById(id)

  if (!course) {
    return (
      <section aria-label="Edit Course" className="flex flex-col gap-6">
        <PageHeader
          title="Course Not Found"
          description="The course you are looking for does not exist."
          backTo={ROUTE_PATHS.COURSES}
          backLabel="Back to Courses"
        />
      </section>
    )
  }

  const handleSubmit = (data) => {
    updateCourse(id, data)
    navigate(courseDetailsPath(id))
  }

  const handleCancel = () => {
    navigate(courseDetailsPath(id))
  }

  return (
    <section aria-label="Edit Course" className="flex flex-col gap-6">
      <PageHeader
        title="Edit Course"
        description={`Update details for ${course.courseName}.`}
        backTo={courseDetailsPath(id)}
        backLabel="Back to Course"
      />

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm
            initialValues={{
              courseId: course.courseId,
              courseName: course.courseName,
              startDate: course.startDate,
              endDate: course.endDate,
              description: course.description,
              status: course.status,
              participants: course.participants ?? [],
              trainers: course.trainers ?? [],
              mediators: course.mediators ?? [],
            }}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
