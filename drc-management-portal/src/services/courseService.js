import api from './api'

export async function fetchCourses() {
  const { data } = await api.get('/courses/')
  return data
}

export async function createCourse(payload) {
  const { data } = await api.post('/courses/', payload)
  return data
}

export async function assignCourseMember(courseId, userId, roleId) {
  const { data } = await api.post(`/courses/${courseId}/members/`, { user: userId, assigned_role: roleId })
  return data
}

export async function updateCourse(id, payload) {
  const { data } = await api.patch(`/courses/${id}/`, payload)
  return data
}

