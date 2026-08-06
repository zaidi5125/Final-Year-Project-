import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'
import { useCalendarItems } from '@/features/home-dashboard/hooks/useCalendarItems'
import { useTasks } from '@/features/tasks/context/TasksContext'
import { isTaskDueToday } from '@/features/tasks/utils/taskStatus'
import { formatDateKey, formatTimeLabel } from '@/features/home-dashboard/utils/calendar'
import { cn } from '@/utils/cn'

export default function TodaysScheduleWidget() {
  const { scheduleItems } = useCalendarItems()
  const { getVisibleTasks } = useTasks()
  const today = new Date()
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const todaysTasks = getVisibleTasks().filter(isTaskDueToday)

  const todaysItems = [
    ...scheduleItems.filter((item) => {
      if (item.type === 'meeting') return item.date === todayKey
      return item.endDate === todayKey || item.startDate === todayKey || item.dueDate === todayKey
    }),
    ...todaysTasks
      .filter((task) => !scheduleItems.some((item) => item.id === task.id))
      .map((task) => ({ ...task, type: 'task' })),
  ].sort((a, b) => {
    if (a.type === 'meeting' && b.type === 'meeting') {
      return (a.startTime || a.time || '').localeCompare(b.startTime || b.time || '')
    }
    return a.type === 'meeting' ? -1 : 1
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Tasks & Schedule</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {todaysItems.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Nothing scheduled today"
            description="Your meetings and tasks for today will show here."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {todaysItems.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full',
                    item.type === 'meeting' ? 'bg-primary' : 'bg-secondary-foreground',
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {item.type}
                    {item.type === 'meeting' && (item.startTime || item.time)
                      ? ` · ${formatTimeLabel(item.startTime || item.time)}`
                      : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
