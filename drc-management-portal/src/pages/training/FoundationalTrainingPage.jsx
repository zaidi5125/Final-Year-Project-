import { Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, PageHeader } from '@/components/shared'
import { useTraining } from '@/features/training/context/TrainingContext'

export default function FoundationalTrainingPage() {
  const { foundationalRecords } = useTraining()
  const isEmpty = foundationalRecords.length === 0

  return (
    <section aria-label="Foundational Training" className="flex flex-col gap-6">
      <PageHeader
        title="Foundational Training"
        description="Manage foundational training records and programs."
      />

      <Card>
        <CardContent className="p-0">
          {isEmpty ? (
            <EmptyState
              icon={Layers}
              title="No Training Records Available"
              description="Foundational training records will appear here once they are created."
            />
          ) : (
            <div className="p-6">
              {/* Records table renders when data exists */}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
