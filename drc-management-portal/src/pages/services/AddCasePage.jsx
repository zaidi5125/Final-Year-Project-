import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import CaseForm from '@/features/services/components/CaseForm'
import { usePartyMembers } from '@/features/party-members/context/PartyMembersContext'
import { useServices } from '@/features/services/context/ServicesContext'
import { EMPTY_VALUES } from '@/features/services/utils/caseFields'
import { caseDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function AddCasePage() {
  const navigate = useNavigate()
  const { addCase } = useServices()
  const { addPartyMember } = usePartyMembers()

  const handleSubmit = (data) => {
    const caseItem = addCase(data)
    if (caseItem && data.partyMembers?.length) {
      data.partyMembers.forEach((member) => {
        addPartyMember({
          ...member,
          caseId: caseItem.id,
          partyId: `${caseItem.id}-${member.partyType}`,
        })
      })
    }
    navigate(caseDetailsPath(caseItem.id))
  }

  return (
    <section aria-label="Create Case" className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="-ml-2 h-8 gap-1 text-muted-foreground" asChild>
            <Link to={ROUTE_PATHS.CASES}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Cases
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <span>Case No.</span>
            <ChevronRight className="size-4" aria-hidden="true" />
            <span className="text-foreground">New Case</span>
          </div>
        </div>
        <Button type="submit" form="case-form">
          Save Case
        </Button>
      </header>

      <CaseForm
        formId="case-form"
        initialValues={EMPTY_VALUES}
        hideBottomActions
        onSubmit={handleSubmit}
      />
    </section>
  )
}
