import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { formatDisplayDate, formatTimeLabel } from '@/features/home-dashboard/utils/calendar'

const DashboardContext = createContext(null)

const initialState = {
  scheduleItems: [],
  notifications: [],
}

function createId() {
  return crypto.randomUUID()
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'ADD_MEETING': {
      const meeting = {
        id: createId(),
        type: 'meeting',
        ...action.payload,
      }

      const notification = {
        id: createId(),
        type: 'meeting',
        title: meeting.title,
        message: `Meeting "${meeting.title}" scheduled for ${formatDisplayDate(meeting.date)}${meeting.time ? ` at ${formatTimeLabel(meeting.time)}` : ''}`,
        createdAt: new Date().toISOString(),
      }

      return {
        scheduleItems: [...state.scheduleItems, meeting],
        notifications: [notification, ...state.notifications],
      }
    }

    case 'ADD_TASK': {
      const task = {
        id: createId(),
        type: 'task',
        ...action.payload,
      }

      const notification = {
        id: createId(),
        type: 'task',
        title: task.title,
        message: `Task "${task.title}" created with due date ${formatDisplayDate(task.dueDate)}`,
        createdAt: new Date().toISOString(),
      }

      return {
        scheduleItems: [...state.scheduleItems, task],
        notifications: [notification, ...state.notifications],
      }
    }

    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  const addMeeting = useCallback((meeting) => {
    dispatch({ type: 'ADD_MEETING', payload: meeting })
  }, [])

  const addTask = useCallback((task) => {
    dispatch({ type: 'ADD_TASK', payload: task })
  }, [])

  const getItemsForDate = useCallback(
    (dateKey) =>
      state.scheduleItems.filter((item) => {
        const itemDate = item.type === 'meeting' ? item.date : item.dueDate
        return itemDate === dateKey
      }),
    [state.scheduleItems],
  )

  const meetings = useMemo(
    () =>
      state.scheduleItems
        .filter((item) => item.type === 'meeting')
        .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')),
    [state.scheduleItems],
  )

  const tasks = useMemo(
    () =>
      state.scheduleItems
        .filter((item) => item.type === 'task')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [state.scheduleItems],
  )

  const value = useMemo(
    () => ({
      scheduleItems: state.scheduleItems,
      notifications: state.notifications,
      meetings,
      tasks,
      addMeeting,
      addTask,
      getItemsForDate,
    }),
    [state, meetings, tasks, addMeeting, addTask, getItemsForDate],
  )

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
