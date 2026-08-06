import { useMemo } from 'react'
import { CheckSquare, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Breadcrumb,
  EmptyState,
  ModuleSubNav,
  PageHeader,
  Pagination,
  SearchFilterBar,
  TableSkeleton,
} from '@/components/shared'
import TasksDataTable from '@/features/tasks/components/TasksDataTable'
import { useTasksQuery } from '@/features/tasks/hooks/useTasksQuery'
import { getTaskDueDate } from '@/features/tasks/utils/taskStatus'
import { useTasks } from '@/features/tasks/context/TasksContext'
import { useTableState } from '@/hooks/useTableState'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { useAuth } from '@/store/AuthContext'

export const TASKS_SUB_NAV_ITEMS = [
  { label: 'List', to: ROUTE_PATHS.TASKS, end: true },
  { label: 'My Tasks', to: ROUTE_PATHS.TASKS_MY },
]

export default function TasksPage() {
  const { softDeleteTask } = useTasks()
  const { data: tasks = [], isLoading } = useTasksQuery()
  const { hasRole } = useAuth()
  const canCreate = hasRole('Admin') || hasRole('Sub Admin')

  const table = useTableState({
    data: tasks,
    searchFields: ['title'],
    sortField: 'dueDate',
    pageSize: 10,
  })

  const sortedData = useMemo(() => {
    const result = [...table.filtered]
    result.sort((a, b) => {
      const aDue = getTaskDueDate(a)
      const bDue = getTaskDueDate(b)
      return aDue.localeCompare(bDue)
    })
    const start = (table.page - 1) * table.pageSize
    return {
      items: result.slice(start, start + table.pageSize),
      total: result.length,
      totalPages: Math.max(1, Math.ceil(result.length / table.pageSize)),
    }
  }, [table.filtered, table.page, table.pageSize])

  const isEmpty = !isLoading && tasks.length === 0

  return (
    <section aria-label="Tasks" className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'Home', to: ROUTE_PATHS.HOME }, { label: 'Tasks' }]} />

      <PageHeader
        title="Tasks"
        description="Create and manage tasks across your team."
        actions={
          canCreate ? (
            <Button asChild>
              <Link to={ROUTE_PATHS.TASK_CREATE}>
                <Plus className="size-4" aria-hidden="true" />
                Create Task
              </Link>
            </Button>
          ) : null
        }
      />

      <ModuleSubNav items={TASKS_SUB_NAV_ITEMS} />

      <SearchFilterBar
        search={table.search}
        onSearchChange={(v) => { table.setSearch(v); table.setPage(1) }}
        searchPlaceholder="Search by title..."
      />

      <Card>
        <CardContent className={isEmpty ? 'p-0' : 'p-0 pt-6'}>
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={6} cols={5} />
            </div>
          ) : isEmpty ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks yet"
              description="Create your first task to get started."
              action={
                canCreate ? (
                  <Button asChild>
                    <Link to={ROUTE_PATHS.TASK_CREATE}>
                      <Plus className="size-4" aria-hidden="true" />
                      Create Task
                    </Link>
                  </Button>
                ) : null
              }
            />
          ) : sortedData.items.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No matching tasks"
              description="Try a different search term."
              action={<Button variant="outline" onClick={() => { table.setSearch(''); table.setPage(1) }}>Clear Search</Button>}
            />
          ) : (
            <>
              <TasksDataTable
                tasks={sortedData.items}
                onDelete={softDeleteTask}
              />
              <div className="border-t border-border px-4 py-4">
                <Pagination
                  page={table.page}
                  totalPages={sortedData.totalPages}
                  totalCount={sortedData.total}
                  pageSize={table.pageSize}
                  onPageChange={table.setPage}
                  onPageSizeChange={(size) => { table.setPageSize(size); table.setPage(1) }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
