import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNotifications } from '@/features/notifications/context/NotificationsContext'
import { fetchTasks, createTask, updateTask as updateTaskApi, deleteTask, updateTaskStatus as updateTaskStatusApi, assignTaskUser } from '@/services/taskService'
import { showError, showSuccess } from '@/utils/toast'

const TasksContext = createContext(null)

function mapTask(t) {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    status: t.status,
    priority: t.priority,
    visibility: 'shared',
    startDate: t.due_date,
    dueDate: t.due_date,
    endDate: t.due_date,
    assignedUsers: (t.assignments ?? []).map((a) => ({
      id: a.id,
      userId: a.user,
      userName: a.assigned_to_name,
    })),
    files: [],
    isDeleted: false,
    is_deleted: false,
    createdByName: t.created_by_name,
  }
}

export function TasksProvider({ children }) {
  const { addNotification } = useNotifications()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchTasks()
      setTasks(data.map(mapTask))
    } catch {
      showError('Could not load tasks.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const addTask = useCallback(async (data) => {
    if (!data.title || !data.title.trim()) {
      showError('Task title is required.')
      return null
    }
    if (!data.dueDate) {
      showError('Due date is required.')
      return null
    }
    try {
      const created = await createTask({
        title: data.title.trim(),
        description: data.description ? data.description.trim() : '',
        priority: data.priority || 'medium',
        status: data.status || 'pending',
        due_date: data.dueDate,
      })

      const assignedUsers = data.assignedUsers || []
      for (let i = 0; i < assignedUsers.length; i++) {
        try {
          await assignTaskUser(created.id, assignedUsers[i].userId)
        } catch {
          // continue with remaining assignments
        }
      }

      await loadTasks()
      addNotification({
        type: 'task',
        title: created.title,
        message: 'Task "' + created.title + '" has been created.',
      })
      showSuccess('Task "' + created.title + '" created successfully.')
      return mapTask(created)
    } catch (error) {
      showError('Could not create task.')
      return null
    }
  }, [addNotification, loadTasks])

  const updateTask = useCallback(async (id, data) => {
    try {
      await updateTaskApi(id, {
        title: data.title ? data.title.trim() : undefined,
        description: data.description ? data.description.trim() : undefined,
        priority: data.priority,
        status: data.status,
        due_date: data.dueDate,
      })

      const assignedUsers = data.assignedUsers || []
      for (let i = 0; i < assignedUsers.length; i++) {
        try {
          await assignTaskUser(id, assignedUsers[i].userId)
        } catch {
          // ignore duplicates or failures
        }
      }

      await loadTasks()
      showSuccess('Task updated successfully.')
    } catch {
      showError('Could not update task.')
    }
  }, [loadTasks])

  const updateTaskStatus = useCallback(async (id, status) => {
    try {
      await updateTaskStatusApi(id, status)
      await loadTasks()
      showSuccess('Task status updated.')
    } catch {
      showError('Could not update task status.')
    }
  }, [loadTasks])

  const softDeleteTask = useCallback(async (id) => {
    try {
      await deleteTask(id)
      await loadTasks()
      showSuccess('Task deleted successfully.')
    } catch {
      showError('Could not delete task.')
    }
  }, [loadTasks])

  const bulkSoftDelete = useCallback(async (ids) => {
    try {
      await Promise.all(ids.map((id) => deleteTask(id)))
      await loadTasks()
      showSuccess(ids.length + ' task(s) deleted.')
    } catch {
      showError('Could not delete tasks.')
    }
  }, [loadTasks])

  const bulkUpdateStatus = useCallback(async (ids, status) => {
    try {
      await Promise.all(ids.map((id) => updateTaskStatusApi(id, status)))
      await loadTasks()
      showSuccess(ids.length + ' task(s) status updated.')
    } catch {
      showError('Could not update tasks.')
    }
  }, [loadTasks])

  const removeTaskFile = useCallback(() => {
    showError('File attachments are not supported yet.')
  }, [])

  const getTaskById = useCallback(
    function (id) {
      return tasks.find(function (t) { return String(t.id) === String(id) })
    },
    [tasks],
  )

  const getTasksForDate = useCallback(
    function (dateKey) {
      return tasks.filter(function (t) { return t.dueDate === dateKey })
    },
    [tasks],
  )

  const getVisibleTasks = useCallback(function () { return tasks }, [tasks])
  const getActiveTasks = useCallback(function () { return tasks }, [tasks])

  const value = useMemo(
    function () {
      return {
        tasks: tasks,
        isLoading: isLoading,
        addTask: addTask,
        updateTask: updateTask,
        updateTaskStatus: updateTaskStatus,
        softDeleteTask: softDeleteTask,
        bulkSoftDelete: bulkSoftDelete,
        bulkUpdateStatus: bulkUpdateStatus,
        removeTaskFile: removeTaskFile,
        getTaskById: getTaskById,
        getTasksForDate: getTasksForDate,
        getVisibleTasks: getVisibleTasks,
        getActiveTasks: getActiveTasks,
      }
    },
    [tasks, isLoading, addTask, updateTask, updateTaskStatus, softDeleteTask, bulkSoftDelete, bulkUpdateStatus, removeTaskFile, getTaskById, getTasksForDate, getVisibleTasks, getActiveTasks],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within TasksProvider')
  return ctx
}
