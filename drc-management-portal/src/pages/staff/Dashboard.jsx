import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, PageHeader, SearchFilterBar } from '@/components/shared'
import { ROUTE_PATHS } from '@/routes/routePaths'

const TYPE_OPTIONS = [
  { value: 'task', label: 'Tasks' },
  { value: 'meeting', label: 'Meetings' },
  { value: 'case', label: 'Cases' },
  { value: 'participant', label: 'Participants' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const SAMPLE_ITEMS = [
  { id: '1', title: 'Call complainant', type: 'task', priority: 'high', status: 'todo', dueDate: '2026-07-28' },
  { id: '2', title: 'Team sync meeting', type: 'meeting', priority: 'medium', status: 'in_progress', dueDate: '2026-07-27' },
  { id: '3', title: 'Update case notes', type: 'case', priority: 'high', status: 'in_progress', dueDate: '2026-07-29' },
  { id: '4', title: 'Register new participant', type: 'participant', priority: 'low', status: 'todo', dueDate: '2026-07-30' },
  { id: '5', title: 'Prepare mediation brief', type: 'task', priority: 'medium', status: 'done', dueDate: '2026-07-20' },
  { id: '6', title: 'Client follow-up meeting', type: 'meeting', priority: 'high', status: 'todo', dueDate: '2026-08-01' },
  { id: '7', title: 'Close resolved case', type: 'case', priority: 'low', status: 'done', dueDate: '2026-07-18' },
  { id: '8', title: 'Verify participant documents', type: 'participant', priority: 'medium', status: 'in_progress', dueDate: '2026-07-31' },
]

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status
}

function getStatusVariant(status) {
  switch (status) {
    case 'todo':
      return 'secondary'
    case 'in_progress':
      return 'warning'
    case 'done':
      return 'success'
    default:
      return 'muted'
  }
}

function getPriorityVariant(priority) {
  switch (priority) {
    case 'low':
      return 'muted'
    case 'medium':
      return 'secondary'
    case 'high':
      return 'destructive'
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
    key: 'type',
    header: 'Type',
    render: (row) => row.type.charAt(0).toUpperCase() + row.type.slice(1),
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (row) => (
      <Badge variant={getPriorityVariant(row.priority)}>
        {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
      </Badge>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due Date',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={getStatusVariant(row.status)}>{getStatusLabel(row.status)}</Badge>
    ),
  },
]

export default function StaffDashboard() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return SAMPLE_ITEMS.filter((item) => {
      const matchesSearch = !query || item.title.toLowerCase().includes(query)
      const matchesType = !typeFilter || item.type === typeFilter
      const matchesPriority = !priorityFilter || item.priority === priorityFilter
      const matchesStatus = !statusFilter || item.status === statusFilter
      return matchesSearch && matchesType && matchesPriority && matchesStatus
    })
  }, [search, typeFilter, priorityFilter, statusFilter])

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('')
    setPriorityFilter('')
    setStatusFilter('')
  }

  return (
    <section aria-label="Staff Dashboard" className="flex flex-col gap-6">
      <PageHeader
        title="Staff Dashboard"
        description="Track your assigned work and filter by type, priority, and status."
        actions={
          <Button variant="outline" asChild>
            <Link to={ROUTE_PATHS.TASKS_MY}>My Tasks</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>Assigned Work</CardTitle>
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search assigned work..."
            filters={[
              {
                key: 'type',
                label: 'All types',
                value: typeFilter,
                onChange: setTypeFilter,
                options: TYPE_OPTIONS,
              },
              {
                key: 'priority',
                label: 'All priorities',
                value: priorityFilter,
                onChange: setPriorityFilter,
                options: PRIORITY_OPTIONS,
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
    </section>
  )
}
