import { Navigate } from 'react-router-dom'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function TrainingPage() {
  return <Navigate to={ROUTE_PATHS.COURSES} replace />
}
