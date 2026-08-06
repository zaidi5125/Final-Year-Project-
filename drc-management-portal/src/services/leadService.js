import api from './api'

export async function fetchLeads() {
  const { data } = await api.get('/leads/')
  return data
}

export async function createLead(payload) {
  const { data } = await api.post('/leads/', payload)
  return data
}

export async function updateLead(id, payload) {
  const { data } = await api.patch(`/leads/${id}/`, payload)
  return data
}

export async function updateLeadStatus(id, status) {
  const { data } = await api.patch(`/leads/${id}/update-status/`, { status })
  return data
}
