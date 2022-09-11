import { useState, createContext, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import { getAccessTokenApi, getRefreshTokenApi, refreshAccessTokenApi, logout } from '../api/auth'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        user: null,
        isLoading: true
    })

    useEffect(() => {
        checkUserLogin(setUser)
    }, [])

    return (
        <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
    )
}

const checkUserLogin = setUser => {
    const accessToken = getAccessTokenApi()

    if (!accessToken) {
        const refreshToken = getRefreshTokenApi()

        if (!refreshToken) {
            logout()
            setUser({ user: null, isLoading: false })

        } else {
            refreshAccessTokenApi(refreshToken)
        }

    } else {
        setUser({
            user: jwtDecode(accessToken),
            isLoading: false,
        })
    }
}

export default AuthProvider