import { Navigate, useParams } from 'react-router-dom'
import { caseDetailsPath } from '@/routes/routePaths'

export default function EditCasePage() {
  const { id } = useParams()
  return <Navigate to={caseDetailsPath(id)} replace />
}
