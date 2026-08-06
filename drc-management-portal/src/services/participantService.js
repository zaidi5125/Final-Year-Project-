import api from './api'

export async function fetchParticipants() {
  const { data } = await api.get('/participants/')
  return data
}

export async function createParticipant(payload) {
  const { data } = await api.post('/participants/', payload)
  return data
}

export async function updateParticipant(id, payload) {
  const { data } = await api.patch(`/participants/${id}/`, payload)
  return data
}
