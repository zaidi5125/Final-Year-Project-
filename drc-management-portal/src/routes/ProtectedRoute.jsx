import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />
  }

  if (user?.forcePasswordChange) {
    return <Navigate to={ROUTE_PATHS.CHANGE_PASSWORD} replace />
  }

  return <Outlet />
}
