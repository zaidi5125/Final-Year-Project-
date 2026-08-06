import api from './api'

export async function fetchTasks() {
  const { data } = await api.get('/tasks/')
  return data
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks/', payload)
  return data
}

export async function updateTask(id, payload) {
  const { data } = await api.patch(`/tasks/${id}/`, payload)
  return data
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}/`)
}

export async function assignTaskUser(taskId, userId) {
  const { data } = await api.post(`/tasks/${taskId}/assign/`, { user: userId })
  return data
}

export async function updateTaskStatus(id, status) {
  const { data } = await api.patch(`/tasks/${id}/update-status/`, { status })
  return data
}

