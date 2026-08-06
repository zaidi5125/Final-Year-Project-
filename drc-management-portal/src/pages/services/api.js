import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Har request ke sath access token attach karo (agar available ho)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('drc_access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Agar access token expire ho jaye (401 error), to refresh token se naya token le lo
let isRefreshing = false
let refreshQueue = []

function processQueue(error, token = null) {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve(token)
    })
    refreshQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            const refreshToken = localStorage.getItem('drc_refresh_token')

            if (!refreshToken) {
                isRefreshing = false
                localStorage.removeItem('drc_access_token')
                localStorage.removeItem('drc_refresh_token')
                localStorage.removeItem('drc_user')
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                })
                localStorage.setItem('drc_access_token', data.access)
                api.defaults.headers.Authorization = `Bearer ${data.access}`
                processQueue(null, data.access)
                originalRequest.headers.Authorization = `Bearer ${data.access}`
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                localStorage.removeItem('drc_access_token')
                localStorage.removeItem('drc_refresh_token')
                localStorage.removeItem('drc_user')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api