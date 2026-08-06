import { Users, UserCheck, Scale } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'

function MemberList({ items, emptyTitle, emptyDescription }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={emptyTitle}
        description={emptyDescription}
        className="py-6"
      />
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((member) => (
        <li
          key={member.id}
          className="rounded-lg border border-border px-4 py-3 text-sm"
        >
          <p className="font-medium">{member.fullName ?? member.name}</p>
          {(member.participantId || member.email || member.teamName) && (
            <p className="text-xs text-muted-foreground">
              {member.participantId || member.email || member.teamName}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function MembersTab({ course }) {
  const participants = course.participants ?? course.members?.filter((m) => m.role === 'participant') ?? []
  const trainers = course.trainers ?? course.members?.filter((m) => m.role === 'trainer') ?? []
  const mediators = course.mediators ?? course.members?.filter((m) => m.role === 'mediator') ?? []

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" aria-hidden="true" />
            Participants ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList
            items={participants}
            emptyTitle="No participants enrolled"
            emptyDescription="Add participants when creating or editing this course."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="size-4" aria-hidden="true" />
            Trainers ({trainers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList
            items={trainers}
            emptyTitle="No trainers assigned"
            emptyDescription="Assign team members as trainers when creating or editing this course."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="size-4" aria-hidden="true" />
            Mediators ({mediators.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList
            items={mediators}
            emptyTitle="No mediators assigned"
            emptyDescription="Assign team members as mediators when creating or editing this course."
          />
        </CardContent>
      </Card>
    </div>
  )
}
