import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared'
import { useTasks } from '@/features/tasks/context/TasksContext'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_VISIBILITIES,
} from '@/features/tasks/utils/taskStatus'

const EMPTY_FORM = {
  title: '',
  priority: 'medium',
  description: '',
  status: 'pending',
  startDate: '',
  endDate: '',
  visibility: 'private',
}

export default function TaskForm({ selectedDate, onSuccess }) {
  const { addTask } = useTasks()
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    startDate: selectedDate ?? '',
    endDate: selectedDate ?? '',
  })
  const [dateError, setDateError] = useState('')

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.startDate || !form.endDate) return

    if (form.endDate < form.startDate) {
      setDateError('End date must be on or after start date.')
      return
    }

    addTask({
      title: form.title.trim(),
      priority: form.priority,
      description: form.description.trim(),
      status: form.status,
      startDate: form.startDate,
      dueDate: form.endDate,
      endDate: form.endDate,
      visibility: form.visibility,
    })

    setForm({ ...EMPTY_FORM, startDate: selectedDate ?? '', endDate: selectedDate ?? '' })
    setDateError('')
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Title" htmlFor="task-title" required>
        <Input
          id="task-title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Task title"
          required
        />
      </FormField>

      <FormField label="Priority" htmlFor="task-priority">
        <Select
          id="task-priority"
          value={form.priority}
          onChange={(e) => updateField('priority', e.target.value)}
        >
          {TASK_PRIORITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Description" htmlFor="task-description">
        <Textarea
          id="task-description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Task details"
          rows={3}
        />
      </FormField>

      <FormField label="Status" htmlFor="task-status">
        <Select
          id="task-status"
          value={form.status}
          onChange={(e) => updateField('status', e.target.value)}
        >
          {TASK_STATUSES.filter((item) => item.value !== 'overdue').map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Start Date" htmlFor="task-start-date" required>
        <Input
          id="task-start-date"
          type="date"
          value={form.startDate}
          onChange={(e) => updateField('startDate', e.target.value)}
          required
        />
      </FormField>

      <FormField label="End Date" htmlFor="task-end-date" required>
        <Input
          id="task-end-date"
          type="date"
          value={form.endDate}
          onChange={(e) => updateField('endDate', e.target.value)}
          required
        />
      </FormField>

      {dateError && <p className="text-sm text-destructive">{dateError}</p>}

      <FormField label="Visibility" htmlFor="task-visibility">
        <Select
          id="task-visibility"
          value={form.visibility}
          onChange={(e) => updateField('visibility', e.target.value)}
        >
          {TASK_VISIBILITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormField>

      <Button type="submit" className="w-full">
        Save Task
      </Button>
    </form>
  )
}
