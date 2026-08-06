import { Navigate } from 'react-router-dom'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function LeadsPage() {
  return <Navigate to={ROUTE_PATHS.LEADS_LIST} replace />
}
