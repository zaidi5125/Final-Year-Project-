import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TaskStatusBadge from '@/features/tasks/components/TaskStatusBadge'
import {
  getAssignedUserNames,
  getPriorityLabel,
  getPriorityVariant,
  getTaskDueDate,
  getVisibilityLabel,
  TASK_STATUSES,
} from '@/features/tasks/utils/taskStatus'
import { taskDetailsPath, taskEditPath } from '@/routes/routePaths'
import { formatDate, formatDateTime } from '@/utils/formatDate'

export default function TasksDataTable({
  tasks,
  onDelete,
  onBulkDelete,
  onBulkStatusUpdate,
  selectedIds = [],
  onSelectionChange,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [sorting, setSorting] = useState([{ id: 'dueDate', desc: false }])

  const selectionEnabled = Boolean(onSelectionChange)

  const columns = useMemo(
    () => [
      ...(selectionEnabled
        ? [{
            id: 'select',
            header: ({ table }) => (
              <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select ${row.original.title}`}
              />
            ),
            enableSorting: false,
          }]
        : []),
      {
        accessorKey: 'title',
        header: 'Task Title',
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-[200px] text-muted-foreground">
            {row.original.description || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <TaskStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) =>
          row.original.priority ? (
            <Badge variant={getPriorityVariant(row.original.priority)}>
              {getPriorityLabel(row.original.priority)}
            </Badge>
          ) : '—',
      },
      {
        accessorKey: 'visibility',
        header: 'Visibility',
        cell: ({ row }) => getVisibilityLabel(row.original.visibility) || '—',
      },
      {
        id: 'startDate',
        accessorFn: (row) => row.startDate,
        header: 'Start Date',
        cell: ({ row }) => formatDate(row.original.startDate),
      },
      {
        id: 'dueDate',
        accessorFn: (row) => getTaskDueDate(row),
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Due Date
            <ArrowUpDown className="size-3.5" />
          </button>
        ),
        cell: ({ row }) => formatDate(getTaskDueDate(row.original)),
      },
      {
        id: 'assignedUsers',
        header: 'Assigned Users',
        cell: ({ row }) => getAssignedUserNames(row.original) || '—',
      },
      {
        accessorKey: 'createdByName',
        header: 'Created By',
        cell: ({ row }) => row.original.createdByName || '—',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created Date',
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated Date',
        cell: ({ row }) => formatDateTime(row.original.updatedAt),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon-sm" asChild aria-label="View">
              <Link to={taskDetailsPath(row.original.id)}><Eye className="size-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon-sm" asChild aria-label="Edit">
              <Link to={taskEditPath(row.original.id)}><Pencil className="size-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(row.original)} aria-label="Delete">
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [selectionEnabled],
  )

  const rowSelection = useMemo(() => {
    if (!selectionEnabled) return {}
    const sel = {}
    for (const id of selectedIds ?? []) {
      const idx = tasks.findIndex((t) => t.id === id)
      if (idx >= 0) sel[idx] = true
    }
    return sel
  }, [selectedIds, tasks, selectionEnabled])

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      if (!onSelectionChange) return
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      const ids = Object.keys(next)
        .filter((k) => next[k])
        .map((k) => tasks[Number(k)]?.id)
        .filter(Boolean)
      onSelectionChange(ids)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: selectionEnabled,
  })

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-muted/40">
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{task.description || 'No description'}</p>
              </div>
              {onSelectionChange && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(task.id)}
                  onChange={() => {
                    const next = selectedIds.includes(task.id)
                      ? selectedIds.filter((id) => id !== task.id)
                      : [...selectedIds, task.id]
                    onSelectionChange(next)
                  }}
                  aria-label={`Select ${task.title}`}
                />
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <TaskStatusBadge status={task.status} />
              {task.priority && (
                <Badge variant={getPriorityVariant(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Due: {formatDate(getTaskDueDate(task))}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" asChild><Link to={taskDetailsPath(task.id)}>View</Link></Button>
              <Button variant="outline" size="sm" asChild><Link to={taskEditPath(task.id)}>Edit</Link></Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(task)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This is a soft delete.`}
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </>
  )
}

export function TaskBulkActions({ selectedIds, onBulkDelete, onBulkStatusUpdate, onClear }) {
  const [bulkStatus, setBulkStatus] = useState('')

  if (!selectedIds.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
      <span className="text-sm font-medium">{selectedIds.length} selected</span>
      <Select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="w-auto min-w-[140px]">
        <option value="">Update status...</option>
        {TASK_STATUSES.filter((s) => s.value !== 'overdue').map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </Select>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!bulkStatus}
        onClick={() => { onBulkStatusUpdate(selectedIds, bulkStatus); setBulkStatus(''); onClear() }}
      >
        Apply Status
      </Button>
      <Button type="button" variant="destructive" size="sm" onClick={() => { onBulkDelete(selectedIds); onClear() }}>
        Bulk Delete
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>Clear</Button>
    </div>
  )
}
