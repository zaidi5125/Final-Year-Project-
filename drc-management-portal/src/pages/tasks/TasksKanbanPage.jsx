import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModuleSubNav, PageHeader } from '@/components/shared'
import TasksKanban from '@/features/tasks/components/TasksKanban'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { TASKS_SUB_NAV_ITEMS } from '@/pages/tasks/TasksPage'

export default function TasksKanbanPage() {
  return (
    <section aria-label="Tasks Kanban" className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description="Drag tasks between columns to update their status."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.TASK_CREATE}>
              <Plus className="size-4" aria-hidden="true" />
              Create Task
            </Link>
          </Button>
        }
      />

      <ModuleSubNav items={TASKS_SUB_NAV_ITEMS} />

      <TasksKanban />
    </section>
  )
}
