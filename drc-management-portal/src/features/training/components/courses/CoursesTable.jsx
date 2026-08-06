import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/shared'
import CourseStatusBadge from '@/features/training/components/CourseStatusBadge'
import { courseDetailsPath } from '@/routes/routePaths'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const columns = [
  {
    key: 'courseId',
    header: 'Course ID',
    render: (row) => <span className="font-medium">{row.courseId}</span>,
  },
  {
    key: 'courseName',
    header: 'Course Name',
  },
  {
    key: 'startDate',
    header: 'Start Date',
    render: (row) => formatDate(row.startDate),
  },
  {
    key: 'endDate',
    header: 'End Date',
    render: (row) => formatDate(row.endDate),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <CourseStatusBadge status={row.status} />,
  },
]

export default function CoursesTable({ courses }) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={courses}
      onRowClick={(course) => navigate(courseDetailsPath(course.id))}
    />
  )
}
