import api from './api'

export async function fetchMeetings() {
  const { data } = await api.get('/meetings/')
  return data
}

export async function createMeeting(payload) {
  const { data } = await api.post('/meetings/', payload)
  return data
}

export async function updateMeeting(id, payload) {
  const { data } = await api.patch(`/meetings/${id}/`, payload)
  return data
}
