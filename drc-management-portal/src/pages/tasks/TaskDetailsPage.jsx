import { useState } from 'react'
import { Pencil, Trash2, Download, FileText } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  ConfirmDialog,
  DetailItem,
  PageHeader,
  SectionCard,
} from '@/components/shared'
import TaskStatusBadge from '@/features/tasks/components/TaskStatusBadge'
import { useTasks } from '@/features/tasks/context/TasksContext'
import {
  getPriorityLabel,
  getPriorityVariant,
  getTaskDueDate,
  getVisibilityLabel,
} from '@/features/tasks/utils/taskStatus'
import { ROUTE_PATHS, taskEditPath } from '@/routes/routePaths'
import { formatDate, formatDateTime } from '@/utils/formatDate'

export default function TaskDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { getTaskById, softDeleteTask, removeTaskFile } = useTasks()
  const task = getTaskById(id) ?? location.state?.task
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!task) {
    return (
      <section aria-label="Task Details" className="flex flex-col gap-6">
        <PageHeader
          title="Task Not Found"
          description="The task you are looking for does not exist."
          backTo={ROUTE_PATHS.TASKS}
          backLabel="Back to Tasks"
        />
      </section>
    )
  }

  const handleDownload = (file) => {
    const blob = new Blob([`File: ${file.name}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-label="Task Details" className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Tasks', to: ROUTE_PATHS.TASKS },
          { label: task.title },
        ]}
      />

      <PageHeader
        title={task.title}
        description={task.description || 'No description provided.'}
        backTo={ROUTE_PATHS.TASKS}
        backLabel="Back to Tasks"
        actions={
          <>
            <TaskStatusBadge status={task.status} />
            <Button variant="outline" asChild>
              <Link to={taskEditPath(id)}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit Task
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          </>
        }
      />

      <SectionCard title="Basic Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Task Title" value={task.title} />
          <div className="sm:col-span-2">
            <DetailItem label="Description" value={task.description || '—'} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Task Settings">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
            <TaskStatusBadge status={task.status} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority</p>
            {task.priority ? (
              <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
            ) : '—'}
          </div>
          <DetailItem label="Visibility" value={getVisibilityLabel(task.visibility)} />
        </div>
      </SectionCard>

      <SectionCard title="Dates">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Start Date" value={formatDate(task.startDate)} />
          <DetailItem label="Due Date" value={formatDate(getTaskDueDate(task))} />
        </div>
      </SectionCard>

      <SectionCard title="Assigned Users">
        {(task.assignedUsers ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No users assigned.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2 text-xs font-medium uppercase text-muted-foreground">Assigned User</th>
                  <th className="px-4 py-2 text-xs font-medium uppercase text-muted-foreground">Assigned By</th>
                  <th className="px-4 py-2 text-xs font-medium uppercase text-muted-foreground">Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {task.assignedUsers.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2">{a.userName}</td>
                    <td className="px-4 py-2">{a.assignedByName}</td>
                    <td className="px-4 py-2">{formatDateTime(a.assignedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Files">
        {(task.files ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No files uploaded.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {task.files.map((file) => (
              <li key={file.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDownload(file)} aria-label="Download">
                    <Download className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeTaskFile(id, file.id)} aria-label="Delete file">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Audit Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Created By" value={task.createdByName || '—'} />
          <DetailItem label="Created Date" value={formatDateTime(task.createdAt)} />
          <DetailItem label="Updated By" value={task.updatedByName || '—'} />
          <DetailItem label="Updated Date" value={formatDateTime(task.updatedAt)} />
        </div>
      </SectionCard>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action soft-deletes the task.`}
        confirmLabel="Delete"
        onConfirm={() => {
          softDeleteTask(id)
          setDeleteOpen(false)
          navigate(ROUTE_PATHS.TASKS)
        }}
      />
    </section>
  )
}
