import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField, SectionCard } from '@/components/shared'
import {
  ALLOWED_FILE_TYPES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_VISIBILITIES,
} from '@/features/tasks/utils/taskStatus'
import { taskSchema } from '@/features/tasks/utils/taskSchema'
import { createId } from '@/utils/id'
import { fetchUsers } from '@/services/userService'
import { ROUTE_PATHS } from '@/routes/routePaths'

const EMPTY_VALUES = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  visibility: 'private',
  startDate: '',
  dueDate: '',
}

export default function TaskForm({
  initialValues = EMPTY_VALUES,
  initialAssignments = [],
  initialFiles = [],
  submitLabel = 'Save Task',
  onSubmit,
  onCancel,
  showStatus = false,
}) {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [files, setFiles] = useState(initialFiles)
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data.filter((u) => u.isActive !== false)))
      .catch(() => setUsers([]))
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialValues.title ?? '',
      description: initialValues.description ?? '',
      status: initialValues.status ?? 'pending',
      priority: initialValues.priority ?? 'medium',
      visibility: initialValues.visibility ?? 'private',
      startDate: initialValues.startDate ?? initialValues.dueDate ?? '',
      dueDate: initialValues.dueDate ?? initialValues.endDate ?? '',
    },
  })

  const handleAddAssignment = () => {
    if (!selectedUserId) return
    const member = users.find((u) => String(u.id) === String(selectedUserId))
    if (!member) return
    if (assignments.some((a) => String(a.userId) === String(member.id))) return

    setAssignments((prev) => [
      ...prev,
      { id: createId(), userId: member.id, userName: member.username },
    ])
    setSelectedUserId('')
  }

  const handleRemoveAssignment = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleFilesSelected = (selectedFiles) => {
    const newFiles = selectedFiles.map((file) => ({
      id: createId(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const onFormSubmit = (data) => {
    onSubmit({ ...data, assignedUsers: assignments, files })
  }

  const availableUsers = users.filter(
    (u) => !assignments.some((a) => String(a.userId) === String(u.id)),
  )

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
      <SectionCard title="Basic Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Task Title" htmlFor="title" required className="sm:col-span-2" error={errors.title?.message}>
            <Input id="title" placeholder="Task title" {...register('title')} />
          </FormField>
          <FormField label="Description" htmlFor="description" className="sm:col-span-2">
            <Textarea id="description" placeholder="Task details" rows={4} {...register('description')} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Task Settings">
        <div className="grid gap-5 sm:grid-cols-2">
          {showStatus && (
            <FormField label="Status" htmlFor="status">
              <Select id="status" {...register('status')}>
                {TASK_STATUSES.filter((s) => s.value !== 'overdue').map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Select>
            </FormField>
          )}
          <FormField label="Priority" htmlFor="priority">
            <Select id="priority" {...register('priority')}>
              {TASK_PRIORITIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Visibility" htmlFor="visibility">
            <Select id="visibility" {...register('visibility')}>
              {TASK_VISIBILITIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Dates">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Start Date" htmlFor="startDate" required error={errors.startDate?.message}>
            <Input id="startDate" type="date" {...register('startDate')} />
          </FormField>
          <FormField label="Due Date" htmlFor="dueDate" required error={errors.dueDate?.message}>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Assign Users">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <FormField label="Assigned User" htmlFor="assignUser" className="min-w-[200px] flex-1">
              <Select
                id="assignUser"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Select team member</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </Select>
            </FormField>
            <Button type="button" onClick={handleAddAssignment}>
              <Plus className="size-4" aria-hidden="true" />
              Add
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to={ROUTE_PATHS.MANAGE_USERS + "?add=1"}>
                <Plus className="size-4" aria-hidden="true" />
                Add User
              </Link>
            </Button>
          </div>
          {assignments.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {assignments.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm">
                  <span>{a.userName}</span>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => handleRemoveAssignment(a.id)} aria-label="Remove assignment">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No users assigned yet.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Task Files">
        <div className="flex flex-col gap-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-6 text-center transition-colors hover:border-primary/40">
            <Plus className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Upload PDF, DOCX, XLSX, or Images</span>
            <input
              type="file"
              className="sr-only"
              multiple
              accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
              onChange={(e) => {
                const selected = Array.from(e.target.files ?? [])
                const valid = selected.filter((f) => ALLOWED_FILE_TYPES.includes(f.type) || f.name.match(/\.(pdf|docx|xlsx|jpe?g|png|gif|webp)$/i))
                if (valid.length) handleFilesSelected(valid)
                e.target.value = ''
              }}
            />
          </label>
          {files.length > 0 && (
            <ul className="flex flex-col gap-2">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm">
                  <span className="truncate">{file.name}</span>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => handleRemoveFile(file.id)} aria-label="Remove file">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SectionCard>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  )
}





