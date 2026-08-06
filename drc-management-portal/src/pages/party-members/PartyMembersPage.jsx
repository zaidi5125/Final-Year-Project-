import { useMemo } from 'react'
import { Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Breadcrumb,
  EmptyState,
  PageHeader,
  Pagination,
  SearchFilterBar,
  TableSkeleton,
} from '@/components/shared'
import PartyMembersTable from '@/features/party-members/components/PartyMembersTable'
import { usePartyMembers } from '@/features/party-members/context/PartyMembersContext'
import { usePartyMembersQuery } from '@/features/party-members/hooks/usePartyMembersQuery'
import { PARTY_MEMBER_GENDERS, PARTY_TYPES } from '@/features/party-members/utils/partyMemberFields'
import { useServices } from '@/features/services/context/ServicesContext'
import { getCaseDisplayTitle } from '@/features/services/utils/caseFields'
import { useTableState } from '@/hooks/useTableState'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function PartyMembersPage() {
  const { deletePartyMember } = usePartyMembers()
  const { data: members = [], isLoading } = usePartyMembersQuery()
  const { cases } = useServices()

  const table = useTableState({
    data: members,
    searchFields: ['fullName', 'cnic'],
    pageSize: 10,
  })

  const paginatedMembers = useMemo(() => {
    const start = (table.page - 1) * table.pageSize
    return table.filtered.slice(start, start + table.pageSize)
  }, [table.filtered, table.page, table.pageSize])

  const totalPages = Math.max(1, Math.ceil(table.filtered.length / table.pageSize))

  return (
    <section aria-label="Party Members" className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTE_PATHS.HOME },
          { label: 'Services', to: ROUTE_PATHS.SERVICES },
          { label: 'Party Members' },
        ]}
      />

      <PageHeader
        title="Party Members"
        description="Manage members belonging to case parties."
        actions={
          <Button asChild>
            <Link to={ROUTE_PATHS.PARTY_MEMBER_CREATE}>
              <Plus className="size-4" /> Add Party Member
            </Link>
          </Button>
        }
      />

      <SearchFilterBar
        search={table.search}
        onSearchChange={(v) => { table.setSearch(v); table.setPage(1) }}
        searchPlaceholder="Search by full name or CNIC..."
        filters={[
          {
            key: 'caseId',
            label: 'All Cases',
            value: table.activeFilters.caseId ?? '',
            onChange: (v) => table.setFilter('caseId', v),
            options: cases.map((c) => ({ value: c.id, label: getCaseDisplayTitle(c) })),
          },
          {
            key: 'partyType',
            label: 'All Party Types',
            value: table.activeFilters.partyType ?? '',
            onChange: (v) => table.setFilter('partyType', v),
            options: PARTY_TYPES.map((p) => ({ value: p.value, label: p.label })),
          },
          {
            key: 'gender',
            label: 'All Genders',
            value: table.activeFilters.gender ?? '',
            onChange: (v) => table.setFilter('gender', v),
            options: PARTY_MEMBER_GENDERS.map((g) => ({ value: g.value, label: g.label })),
          },
        ]}
      />

      <Card>
        <CardContent className={!isLoading && members.length === 0 ? 'p-0' : 'p-0 pt-6'}>
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={6} cols={5} />
            </div>
          ) : members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No party members yet"
              description="Add members to case parties."
              action={
                <Button asChild>
                  <Link to={ROUTE_PATHS.PARTY_MEMBER_CREATE}>
                    <Plus className="size-4" /> Add Party Member
                  </Link>
                </Button>
              }
            />
          ) : table.filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No matching members"
              description="Adjust your search or filters."
              action={<Button variant="outline" onClick={table.clearFilters}>Clear Filters</Button>}
            />
          ) : (
            <>
              <PartyMembersTable members={paginatedMembers} onDelete={deletePartyMember} />
              <div className="border-t border-border px-4 py-4">
                <Pagination
                  page={table.page}
                  totalPages={totalPages}
                  totalCount={table.filtered.length}
                  pageSize={table.pageSize}
                  onPageChange={table.setPage}
                  onPageSizeChange={(s) => { table.setPageSize(s); table.setPage(1) }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
