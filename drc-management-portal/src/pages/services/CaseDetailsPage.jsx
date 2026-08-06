import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CaseForm from '@/features/services/components/CaseForm'
import { useServices } from '@/features/services/context/ServicesContext'
import {
  getCaseDisplayId,
  getCaseDisplayTitle,
  mapCaseToFormValues,
} from '@/features/services/utils/caseFields'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function CaseDetailsPage() {
  const { id } = useParams()
  const { getCaseById, updateCase } = useServices()
  const caseItem = getCaseById(id)

  if (!caseItem) {
    return (
      <section aria-label="Case Details" className="flex flex-col gap-6">
        <header className="space-y-2">
          <Button variant="ghost" size="sm" className="-ml-2 h-8 gap-1 text-muted-foreground" asChild>
            <Link to={ROUTE_PATHS.CASES}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Cases
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Case Not Found</h1>
          <p className="text-sm text-muted-foreground">The case you are looking for does not exist.</p>
        </header>
      </section>
    )
  }

  const handleSubmit = (data) => {
    updateCase(id, data)
  }

  const caseId = getCaseDisplayId(caseItem)
  const caseTitle = getCaseDisplayTitle(caseItem)

  return (
    <section aria-label="Case Details" className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="-ml-2 h-8 gap-1 text-muted-foreground" asChild>
            <Link to={ROUTE_PATHS.CASES}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Cases
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span className="text-muted-foreground">Case No.</span>
            <span className="font-medium text-foreground">{caseId || '—'}</span>
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium text-foreground">{caseTitle}</span>
          </div>
        </div>
        <Button type="submit" form="case-form">
          Save Case
        </Button>
      </header>

      <CaseForm
        formId="case-form"
        initialValues={mapCaseToFormValues(caseItem)}
        caseId={id}
        hideBottomActions
        onSubmit={handleSubmit}
      />
    </section>
  )
}
