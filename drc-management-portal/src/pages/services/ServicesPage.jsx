import { Navigate } from 'react-router-dom'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function ServicesPage() {
  return <Navigate to={ROUTE_PATHS.CASES} replace />
}
