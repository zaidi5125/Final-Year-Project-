import { useTasks } from '@/features/tasks/context/TasksContext'

export function useTasksQuery() {
  const { tasks, isLoading } = useTasks()
  return { data: tasks, isLoading }
}
