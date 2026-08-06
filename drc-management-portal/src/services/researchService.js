import api from './api'

export async function fetchResearches() {
  const { data } = await api.get('/research/')
  return data
}

export async function createResearch(payload) {
  const { data } = await api.post('/research/', payload)
  return data
}

export async function updateResearch(id, payload) {
  const { data } = await api.patch(`/research/${id}/`, payload)
  return data
}
