import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ModuleSubNav, PageHeader } from '@/components/shared'
import LeadImportDropzone from '@/features/leads/components/LeadImportDropzone'
import LeadsBoard from '@/features/leads/components/LeadsBoard'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { ROUTE_PATHS } from '@/routes/routePaths'

const SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.LEADS_LIST },
  { label: 'Board', to: ROUTE_PATHS.LEADS_BOARD, end: true },
  { label: 'Dashboard', to: ROUTE_PATHS.LEADS_DASHBOARD },
]

export default function LeadsBoardPage() {
  const { bulkImportLeads } = useLeads()

  return (
    <section aria-label="Leads Board" className="flex flex-col gap-6">
      <PageHeader
        title="Leads Board"
        description="Drag leads between status columns and zones."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.LEAD_CREATE}>
              <Plus className="size-4" aria-hidden="true" />
              Add Lead
            </Link>
          </Button>
        }
      />

      <ModuleSubNav items={SUB_NAV_ITEMS} />

      <LeadImportDropzone onImport={bulkImportLeads} />

      <Card>
        <CardContent className="pt-6">
          <LeadsBoard />
        </CardContent>
      </Card>
    </section>
  )
}
