import api from './api'

export async function loginUser(username, password) {
    const { data } = await api.post('/auth/login/', { username, password })
    return data
}

export async function logoutUser(refreshToken) {
    try {
        await api.post('/auth/logout/', { refresh: refreshToken })
    } catch {
        // Agar logout API fail bhi ho, hum local session clear kar denge
    }
}

export async function fetchCurrentUser() {
    const { data } = await api.get('/auth/me/')
    return data
}

export async function changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
    })
    return data
}
