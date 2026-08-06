import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, logoutUser } from '@/services/authService'

const AuthContext = createContext(null)

function readStoredUser() {
    try {
        const raw = localStorage.getItem('drc_user')
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Agar page reload ho, tab bhi login state maintain rahe
        const storedUser = readStoredUser()
        if (storedUser) setUser(storedUser)
    }, [])

    async function login(username, password) {
        setIsLoading(true)
        try {
            const data = await loginUser(username, password)
            const loggedInUser = {
                id: data.user.id,
                username: data.user.username,
                fullName: data.user.full_name,
                email: data.user.email,
                isStaff: data.user.is_staff,
                forcePasswordChange: data.user.force_password_change,
                roles: data.user.roles,
            }

            localStorage.setItem('drc_access_token', data.access)
            localStorage.setItem('drc_refresh_token', data.refresh)
            localStorage.setItem('drc_user', JSON.stringify(loggedInUser))

            setUser(loggedInUser)
            return loggedInUser
        } finally {
            setIsLoading(false)
        }
    }

    async function logout() {
        const refreshToken = localStorage.getItem('drc_refresh_token')
        await logoutUser(refreshToken)
        localStorage.removeItem('drc_access_token')
        localStorage.removeItem('drc_refresh_token')
        localStorage.removeItem('drc_user')
        setUser(null)
    }

    function hasRole(roleName) {
        return user?.roles?.some((r) => r.toLowerCase() === roleName.toLowerCase()) ?? false
    }

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}