import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { EmptyState } from '@/components/shared'
import { useTasks } from '@/features/tasks/context/TasksContext'
import { getAssignedUserNames, getTaskDueDate } from '@/features/tasks/utils/taskStatus'
import { taskDetailsPath } from '@/routes/routePaths'
import { formatDate } from '@/utils/formatDate'

function TaskCard({ task, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
      className="cursor-grab rounded-lg border border-border bg-background p-3 shadow-soft active:cursor-grabbing"
    >
      <Link
        to={taskDetailsPath(task.id)}
        className="text-sm font-medium text-foreground hover:text-primary"
        onClick={(event) => event.stopPropagation()}
      >
        {task.title}
      </Link>
      {getTaskDueDate(task) && (
        <p className="mt-1 text-xs text-muted-foreground">Due {formatDate(getTaskDueDate(task))}</p>
      )}
      {getAssignedUserNames(task) && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {getAssignedUserNames(task)}
        </p>
      )}
    </div>
  )
}

function StatusColumn({
  status,
  label,
  tasks,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
}) {
  return (
    <div
      aria-label={`${label} column`}
      data-status={status}
      className={cn(
        'flex min-h-[200px] flex-col gap-2 rounded-xl border border-dashed p-3 transition-colors',
        isDragOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        <span className="ml-1 text-muted-foreground/70">({tasks.length})</span>
      </p>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

export default function TasksKanban() {
  const { tasks, updateTaskStatus } = useTasks()
  const [dragOverStatus, setDragOverStatus] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData('text/plain', taskId)
    event.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDragOverStatus(null)
  }

  const handleDragOver = (event, status) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverStatus(status)
  }

  const handleDragLeave = () => {
    setDragOverStatus(null)
  }

  const handleDrop = (event, targetStatus) => {
    event.preventDefault()
    setDragOverStatus(null)

    const taskId = event.dataTransfer.getData('text/plain')
    if (!taskId) return

    const task = tasks.find((item) => item.id === taskId)
    if (!task || task.status === targetStatus) return

    updateTaskStatus(taskId, targetStatus)
  }

  if (tasks.length === 0 && !isDragging) {
    return (
      <EmptyState
        title="No tasks on the board"
        description="Create tasks to organize them by status."
        className="rounded-xl border border-dashed border-border"
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {TASK_STATUSES.map((statusItem) => {
        const columnTasks = tasks.filter((task) => task.status === statusItem.value)

        return (
          <StatusColumn
            key={statusItem.value}
            status={statusItem.value}
            label={statusItem.label}
            tasks={columnTasks}
            isDragOver={dragOverStatus === statusItem.value}
            onDragOver={(event) => handleDragOver(event, statusItem.value)}
            onDragLeave={handleDragLeave}
            onDrop={(event) => handleDrop(event, statusItem.value)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        )
      })}
    </div>
  )
}
