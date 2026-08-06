import { CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'
import { useTasks } from '@/features/tasks/context/TasksContext'
import { isTaskPending } from '@/features/tasks/utils/taskStatus'
import { formatDisplayDate } from '@/features/home-dashboard/utils/calendar'
import { cn } from '@/utils/cn'

const PRIORITY_STYLES = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-accent text-accent-foreground',
  high: 'bg-primary/10 text-primary',
  critical: 'bg-destructive/10 text-destructive',
}

export default function PendingTasksWidget() {
  const { getVisibleTasks } = useTasks()
  const pendingTasks = getVisibleTasks().filter(isTaskPending)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {pendingTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No pending tasks"
            description="Pending and in-progress tasks will appear here."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {pendingTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {formatDisplayDate(task.endDate ?? task.dueDate)}
                  </p>
                </div>
                {task.priority && (
                  <span
                    className={cn(
                      'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium capitalize',
                      PRIORITY_STYLES[task.priority] ?? 'bg-muted text-muted-foreground',
                    )}
                  >
                    {task.priority}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
