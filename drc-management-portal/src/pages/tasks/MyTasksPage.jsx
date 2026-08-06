import { useMemo } from 'react'
import { CheckSquare, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, ModuleSubNav, PageHeader } from '@/components/shared'
import TasksTable from '@/features/tasks/components/TasksTable'
import { useTasks } from '@/features/tasks/context/TasksContext'
import { getAssignedUserNames } from '@/features/tasks/utils/taskStatus'
import { getCurrentUser } from '@/utils/currentUser'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { TASKS_SUB_NAV_ITEMS } from '@/pages/tasks/TasksPage'

export default function MyTasksPage() {
  const { getVisibleTasks } = useTasks()
  const currentUser = getCurrentUser()

  const filteredTasks = useMemo(() => {
    return getVisibleTasks().filter((task) =>
      (task.assignedUsers ?? []).some((a) => a.userId === currentUser.id) ||
      task.createdBy === currentUser.id,
    )
  }, [getVisibleTasks, currentUser.id])

  return (
    <section aria-label="My Tasks" className="flex flex-col gap-6">
      <PageHeader
        title="My Tasks"
        description={`View tasks assigned to or created by ${currentUser.fullName}.`}
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

      <Card>
        <CardContent className={filteredTasks.length === 0 ? 'p-0' : 'p-0 pt-6'}>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks assigned to you"
              description="Tasks assigned to you will appear here."
              action={
                <Button asChild>
                  <Link to={ROUTE_PATHS.TASK_CREATE}>
                    <Plus className="size-4" aria-hidden="true" />
                    Create Task
                  </Link>
                </Button>
              }
            />
          ) : (
            <TasksTable tasks={filteredTasks.map((t) => ({
              ...t,
              assignedToName: getAssignedUserNames(t),
            }))} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
