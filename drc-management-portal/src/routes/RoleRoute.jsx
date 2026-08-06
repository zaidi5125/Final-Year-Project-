import { Navigate } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function RoleRoute({ allowedRoles, excludeRoles, children }) {
  const { hasRole } = useAuth()

  let isAllowed
  if (excludeRoles) {
    isAllowed = !excludeRoles.some((role) => hasRole(role))
  } else {
    isAllowed = allowedRoles.some((role) => hasRole(role))
  }

  if (!isAllowed) {
    return <Navigate to={ROUTE_PATHS.UNAUTHORIZED} replace />
  }

  return children
}
