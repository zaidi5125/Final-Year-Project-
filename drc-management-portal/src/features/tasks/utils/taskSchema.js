import { z } from 'zod'

export const taskSchema = z
  .object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    visibility: z.enum(['private', 'shared']).optional(),
    startDate: z.string().min(1, 'Start date is required'),
    dueDate: z.string().min(1, 'Due date is required'),
  })
  .refine((data) => data.dueDate >= data.startDate, {
    message: 'Due date cannot be before start date',
    path: ['dueDate'],
  })

export const taskAssignmentSchema = z.object({
  userId: z.string().min(1, 'Assigned user is required'),
  userName: z.string().min(1),
})
