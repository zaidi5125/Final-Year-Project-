import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModuleSubNav, PageHeader } from '@/components/shared'
import TasksCalendar from '@/features/tasks/components/TasksCalendar'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { TASKS_SUB_NAV_ITEMS } from '@/pages/tasks/TasksPage'

export default function TasksCalendarPage() {
  return (
    <section aria-label="Tasks Calendar" className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description="View tasks by due date on the calendar."
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

      <TasksCalendar />
    </section>
  )
}
