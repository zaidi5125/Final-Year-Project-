import api from './api'

export async function fetchCases() {
  const { data } = await api.get('/cases/')
  return data
}

export async function createCase(payload) {
  const { data } = await api.post('/cases/', payload)
  return data
}

export async function updateCase(id, payload) {
  const { data } = await api.patch(`/cases/${id}/`, payload)
  return data
}
