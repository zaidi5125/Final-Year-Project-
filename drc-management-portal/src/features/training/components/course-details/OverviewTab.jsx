import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CourseStatusBadge from '@/features/training/components/CourseStatusBadge'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value || '—'}</p>
    </div>
  )
}

function MemberNamesList({ items, emptyLabel }) {
  if (!items?.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          <p className="font-medium">{item.name}</p>
          {(item.teamName || item.email) && (
            <p className="text-xs text-muted-foreground">{item.teamName || item.email}</p>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function OverviewTab({ course }) {
  const mediators =
    course.mediators ?? course.members?.filter((m) => m.role === 'mediator') ?? []

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Course Overview</CardTitle>
        <CourseStatusBadge status={course.status} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Course ID" value={course.courseId} />
          <DetailItem label="Course Name" value={course.courseName} />
          <DetailItem label="Start Date" value={formatDate(course.startDate)} />
          <DetailItem label="End Date" value={formatDate(course.endDate)} />
        </div>

        <DetailItem
          label="Description"
          value={course.description || 'No description provided.'}
        />

        <div className="space-y-2 border-t border-border pt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mediators
          </p>
          <MemberNamesList
            items={mediators}
            emptyLabel="No mediators assigned to this course."
          />
        </div>
      </CardContent>
    </Card>
  )
}
