import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { createId } from '@/utils/id'

const NotificationsContext = createContext(null)
const initialState = { notifications: [], logs: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications], logs: [{ id: createId(), action: 'notification_created', message: action.payload.message, createdAt: new Date().toISOString() }, ...state.logs] }
    case 'MARK_READ':
      return { ...state, notifications: state.notifications.map((n) => n.id === action.payload ? { ...n, read: true } : n) }
    default:
      return state
  }
}

export function NotificationsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addNotification = useCallback((data) => {
    const notification = { id: createId(), read: false, createdAt: new Date().toISOString(), ...data }
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
    return notification
  }, [])

  const markAsRead = useCallback((id) => dispatch({ type: 'MARK_READ', payload: id }), [])

  const value = useMemo(() => ({ ...state, addNotification, markAsRead }), [state, addNotification, markAsRead])
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
