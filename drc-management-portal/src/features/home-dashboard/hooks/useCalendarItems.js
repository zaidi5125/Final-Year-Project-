import { useCallback, useMemo } from 'react'
import { useMeetings } from '@/features/meetings/context/MeetingsContext'
import { useTasks } from '@/features/tasks/context/TasksContext'

export function useCalendarItems() {
  const { meetings, getMeetingsForDate } = useMeetings()
  const { tasks, getTasksForDate } = useTasks()

  const scheduleItems = useMemo(
    () => [
      ...meetings.map((m) => ({ ...m, type: 'meeting' })),
      ...tasks.map((t) => ({ ...t, type: 'task' })),
    ],
    [meetings, tasks],
  )

  const getItemsForDate = useCallback(
    (dateKey) => [
      ...getMeetingsForDate(dateKey).map((m) => ({ ...m, type: 'meeting' })),
      ...getTasksForDate(dateKey).map((t) => ({ ...t, type: 'task' })),
    ],
    [getMeetingsForDate, getTasksForDate],
  )

  return { scheduleItems, meetings, tasks, getItemsForDate }
}
