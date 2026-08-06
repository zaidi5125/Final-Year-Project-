import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb, PageHeader } from '@/components/shared'
import TaskForm from '@/features/tasks/components/TaskForm'
import { useTasks } from '@/features/tasks/context/TasksContext'
import { getTaskDueDate } from '@/features/tasks/utils/taskStatus'
import { ROUTE_PATHS, taskDetailsPath } from '@/routes/routePaths'

export default function EditTaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTaskById, updateTask } = useTasks()
  const task = getTaskById(id)

  if (!task) {
    return (
      <section aria-label="Edit Task" className="flex flex-col gap-6">
        <PageHeader
          title="Task Not Found"
          description="The task you are looking for does not exist."
          backTo={ROUTE_PATHS.TASKS}
          backLabel="Back to Tasks"
        />
      </section>
    )
  }

  return (
    <section aria-label="Edit Task" className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Tasks', to: ROUTE_PATHS.TASKS },
          { label: task.title, to: taskDetailsPath(id) },
          { label: 'Edit' },
        ]}
      />

      <PageHeader
        title="Edit Task"
        description={`Update details for ${task.title}.`}
        backTo={taskDetailsPath(id)}
        backLabel="Back to Task"
      />

      <TaskForm
        initialValues={{
          title: task.title,
          description: task.description,
          startDate: task.startDate,
          dueDate: getTaskDueDate(task),
          priority: task.priority,
          visibility: task.visibility,
          status: task.status,
        }}
        initialAssignments={task.assignedUsers ?? []}
        initialFiles={task.files ?? []}
        submitLabel="Save Changes"
        showStatus
        onSubmit={(data) => {
          updateTask(id, data)
          navigate(taskDetailsPath(id), { state: { task: { ...task, ...data } } })
        }}
        onCancel={() => navigate(taskDetailsPath(id))}
      />
    </section>
  )
}
