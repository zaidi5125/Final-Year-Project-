import api from './api'

export async function fetchUsers() {
  const { data } = await api.get('/users/')
  return data
}

export async function fetchRoles() {
  const { data } = await api.get('/roles/')
  return data
}

export async function createUser(payload) {
  const { data } = await api.post('/users/', payload)
  return data
}

export async function updateUser(id, payload) {
  const { data } = await api.patch(`/users/${id}/`, payload)
  return data
}

export async function deactivateUser(id) {
  const { data } = await api.delete(`/users/${id}/`)
  return data
}
