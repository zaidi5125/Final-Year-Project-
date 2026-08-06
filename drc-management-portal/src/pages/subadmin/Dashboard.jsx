import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, PageHeader, SearchFilterBar } from '@/components/shared'
import { ROUTE_PATHS } from '@/routes/routePaths'

const MODULE_OPTIONS = [
  { value: 'cases', label: 'Cases' },
  { value: 'leads', label: 'Leads' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'participants', label: 'Participants' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
]

const SAMPLE_ITEMS = [
  { id: '1', title: 'Family Dispute Case', module: 'cases', status: 'active', owner: 'Sara Khan', date: '2026-07-12' },
  { id: '2', title: 'Course Lead - Mediation', module: 'leads', status: 'pending', owner: 'Ali Raza', date: '2026-07-18' },
  { id: '3', title: 'Prepare hearing notes', module: 'tasks', status: 'active', owner: 'Staff User', date: '2026-07-20' },
  { id: '4', title: 'Participant - Ahmed', module: 'participants', status: 'completed', owner: 'Subadmin', date: '2026-07-08' },
  { id: '5', title: 'Property Dispute', module: 'cases', status: 'closed', owner: 'Sara Khan', date: '2026-06-30' },
  { id: '6', title: 'Dispute Lead - Commercial', module: 'leads', status: 'active', owner: 'Bilal', date: '2026-07-22' },
  { id: '7', title: 'Follow up with client', module: 'tasks', status: 'pending', owner: 'Staff User', date: '2026-07-25' },
  { id: '8', title: 'Participant - Fatima', module: 'participants', status: 'active', owner: 'Subadmin', date: '2026-07-15' },
]

const RECENT_ACTIVITY = [
  { id: 1, title: 'New course created', detail: 'Mediation Basics', status: 'Completed' },
  { id: 2, title: 'Case updated', detail: 'CASE-1042', status: 'In Progress' },
  { id: 3, title: 'Lead assigned', detail: 'Course Lead - Ali', status: 'Pending' },
  { id: 4, title: 'Team member added', detail: 'Dispute Resolution Team', status: 'Completed' },
]

function getActivityStatusVariant(status) {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'In Progress':
      return 'warning'
    case 'Pending':
      return 'secondary'
    default:
      return 'muted'
  }
}

function getStatusVariant(status) {
  switch (status) {
    case 'active':
      return 'default'
    case 'pending':
      return 'warning'
    case 'completed':
      return 'success'
    case 'closed':
      return 'secondary'
    default:
      return 'muted'
  }
}

const columns = [
  {
    key: 'title',
    header: 'Title',
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: 'module',
    header: 'Module',
    render: (row) => row.module.charAt(0).toUpperCase() + row.module.slice(1),
  },
  {
    key: 'owner',
    header: 'Owner',
  },
  {
    key: 'date',
    header: 'Date',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={getStatusVariant(row.status)}>
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </Badge>
    ),
  },
]

export default function SubadminDashboard() {
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return SAMPLE_ITEMS.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query)
      const matchesModule = !moduleFilter || item.module === moduleFilter
      const matchesStatus = !statusFilter || item.status === statusFilter
      return matchesSearch && matchesModule && matchesStatus
    })
  }, [search, moduleFilter, statusFilter])

  const clearFilters = () => {
    setSearch('')
    setModuleFilter('')
    setStatusFilter('')
  }

  return (
    <section aria-label="Subadmin Dashboard" className="flex flex-col gap-6">
      <PageHeader
        title="Subadmin Dashboard"
        description="Review assigned work and filter cases, leads, tasks, and participants quickly."
        actions={
          <Button variant="outline" asChild>
            <Link to={ROUTE_PATHS.HOME}>Portal Home</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>Work Items</CardTitle>
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by title or owner..."
            filters={[
              {
                key: 'module',
                label: 'All modules',
                value: moduleFilter,
                onChange: setModuleFilter,
                options: MODULE_OPTIONS,
              },
              {
                key: 'status',
                label: 'All statuses',
                value: statusFilter,
                onChange: setStatusFilter,
                options: STATUS_OPTIONS,
              },
            ]}
          >
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </SearchFilterBar>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredItems} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {RECENT_ACTIVITY.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <Badge variant={getActivityStatusVariant(item.status)}>{item.status}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
