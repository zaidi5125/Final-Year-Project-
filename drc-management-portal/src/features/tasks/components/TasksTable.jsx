import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared'
import TaskStatusBadge from '@/features/tasks/components/TaskStatusBadge'
import {
  getPriorityLabel,
  getPriorityVariant,
  getVisibilityLabel,
} from '@/features/tasks/utils/taskStatus'
import { taskDetailsPath } from '@/routes/routePaths'
import { formatDate } from '@/utils/formatDate'

const columns = [
  {
    key: 'title',
    header: 'Title',
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: 'endDate',
    header: 'Due Date',
    render: (row) => formatDate(row.endDate ?? row.dueDate),
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (row) =>
      row.priority ? (
        <Badge variant={getPriorityVariant(row.priority)}>
          {getPriorityLabel(row.priority)}
        </Badge>
      ) : (
        '—'
      ),
  },
  {
    key: 'visibility',
    header: 'Visibility',
    render: (row) => getVisibilityLabel(row.visibility) || '—',
  },
  {
    key: 'assignedToName',
    header: 'Assigned To',
    render: (row) => row.assignedToName || row.assignedTo || '—',
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <TaskStatusBadge status={row.status} />,
  },
]

export default function TasksTable({ tasks }) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={columns}
      data={tasks}
      onRowClick={(task) => navigate(taskDetailsPath(task.id))}
    />
  )
}
