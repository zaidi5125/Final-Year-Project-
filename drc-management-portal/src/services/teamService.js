import api from './api'

export async function fetchTeams() {
  const { data } = await api.get('/teams/')
  return data
}

export async function createTeam(payload) {
  const { data } = await api.post('/teams/', payload)
  return data
}

export async function updateTeam(id, payload) {
  const { data } = await api.patch(`/teams/${id}/`, payload)
  return data
}
