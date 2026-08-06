import { useNavigate } from 'react-router-dom'
import { Breadcrumb, PageHeader } from '@/components/shared'
import TaskForm from '@/features/tasks/components/TaskForm'
import { useTasks } from '@/features/tasks/context/TasksContext'
import { ROUTE_PATHS, taskDetailsPath } from '@/routes/routePaths'

export default function CreateTaskPage() {
  const navigate = useNavigate()
  const { addTask } = useTasks()

  const handleSubmit = (data) => {
    const task = addTask(data)
    if (task) navigate(taskDetailsPath(task.id), { state: { task } })
  }

  return (
    <section aria-label="Create Task" className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Tasks', to: ROUTE_PATHS.TASKS },
          { label: 'Create Task' },
        ]}
      />

      <PageHeader
        title="Create Task"
        description="Add a new task to the system."
        backTo={ROUTE_PATHS.TASKS}
        backLabel="Back to Tasks"
      />

      <TaskForm
        submitLabel="Create Task"
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTE_PATHS.TASKS)}
      />
    </section>
  )
}
