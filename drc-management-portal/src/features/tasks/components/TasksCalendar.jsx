import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'
import CalendarDay from '@/features/home-dashboard/components/Calendar/CalendarDay'
import { useCalendarNavigation } from '@/features/home-dashboard/hooks/useCalendarNavigation'
import {
  formatDisplayDate,
  getCalendarDays,
  getMonthLabel,
  isToday,
  WEEKDAY_LABELS,
} from '@/features/home-dashboard/utils/calendar'
import { useTasks } from '@/features/tasks/context/TasksContext'
import TaskStatusBadge from '@/features/tasks/components/TaskStatusBadge'
import { taskDetailsPath } from '@/routes/routePaths'

export default function TasksCalendar() {
  const { tasks, getTasksForDate } = useTasks()
  const { year, month, goToPreviousMonth, goToNextMonth, goToToday } = useCalendarNavigation()
  const [selectedDateKey, setSelectedDateKey] = useState(null)

  const days = getCalendarDays(year, month)

  const getEventsForDate = (dateKey) =>
    getTasksForDate(dateKey).map((task) => ({
      id: task.id,
      title: task.title,
      type: 'task',
    }))

  const selectedTasks = selectedDateKey ? getTasksForDate(selectedDateKey) : []

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks scheduled"
        description="Create tasks with due dates to see them on the calendar."
        className="rounded-xl border border-dashed border-border"
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Task Calendar</CardTitle>
          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <span className="min-w-[140px] text-center text-sm font-medium">
              {getMonthLabel(year, month)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="py-2 text-center text-xs font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}

            {days.map((day) => (
              <CalendarDay
                key={day.dateKey}
                day={day}
                isCurrentMonth={day.isCurrentMonth}
                isToday={isToday(day.dateKey)}
                events={getEventsForDate(day.dateKey)}
                onSelect={setSelectedDateKey}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDateKey && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tasks for {formatDisplayDate(selectedDateKey)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks due on this date.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {selectedTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
                  >
                    <Link
                      to={taskDetailsPath(task.id)}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      {task.title}
                    </Link>
                    <TaskStatusBadge status={task.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
