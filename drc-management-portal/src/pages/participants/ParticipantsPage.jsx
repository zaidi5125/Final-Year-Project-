import { useMemo, useState } from 'react'
import { Filter, Plus, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, PageHeader } from '@/components/shared'
import FiltersDrawer from '@/features/participants/components/FiltersDrawer'
import ParticipantsTable from '@/features/participants/components/ParticipantsTable'
import { useParticipants } from '@/features/participants/context/ParticipantsContext'
import { getGenderLabel, getStatusLabel } from '@/features/participants/utils/participantFields'
import { ROUTE_PATHS } from '@/routes/routePaths'

const EMPTY_FILTERS = { gender: '', status: '' }

export default function ParticipantsPage() {
  const navigate = useNavigate()
  const { participants } = useParticipants()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  const goToAddParticipant = () => {
    navigate(ROUTE_PATHS.PARTICIPANT_CREATE)
  }

  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      if (filters.gender && participant.gender !== filters.gender) return false
      if (filters.status && participant.status !== filters.status) return false
      return true
    })
  }, [participants, filters])

  const activeFilterCount = [filters.gender, filters.status].filter(Boolean).length
  const hasFilters = activeFilterCount > 0
  const isEmpty = participants.length === 0

  const emptyState = (
    <EmptyState
      icon={UsersRound}
      title={isEmpty ? 'No participants yet' : 'No matching participants'}
      description={
        isEmpty
          ? 'Add course participants to enroll them in training programs.'
          : hasFilters
            ? 'No participants match the current filters. Try adjusting or clearing them.'
            : 'No participants to display.'
      }
      action={
        isEmpty ? (
          <Button type="button" onClick={goToAddParticipant}>
            <Plus className="size-4" aria-hidden="true" />
            Add Participant
          </Button>
        ) : hasFilters ? (
          <Button type="button" variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>
            Clear Filters
          </Button>
        ) : undefined
      }
    />
  )

  return (
    <section aria-label="Participants" className="flex flex-col gap-6">
      <PageHeader
        title="Participants"
        description="Manage course participants and enrollment records."
        actions={
          <>
            <Button variant="outline" onClick={() => setFiltersOpen(true)}>
              <Filter className="size-4" aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Button type="button" onClick={goToAddParticipant}>
              <Plus className="size-4" aria-hidden="true" />
              Add Participant
            </Button>
          </>
        }
      />

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {filters.gender && (
            <Badge variant="outline">Gender: {getGenderLabel(filters.gender)}</Badge>
          )}
          {filters.status && (
            <Badge variant="outline">Status: {getStatusLabel(filters.status)}</Badge>
          )}
        </div>
      )}

      <Card>
        <CardContent className={filteredParticipants.length === 0 ? 'p-0' : 'p-0 pt-6'}>
          {isEmpty ? (
            emptyState
          ) : (
            <ParticipantsTable
              participants={filteredParticipants}
              emptyState={emptyState}
            />
          )}
        </CardContent>
      </Card>

      <FiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onApply={setFilters}
      />
    </section>
  )
}
