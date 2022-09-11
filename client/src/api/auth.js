import { ACCESS_TOKEN, REFRESH_TOKEN } from '../utils/constants'
import { basePath, apiVersion } from './config'
import jwtDecode from 'jwt-decode'

export const getAccessTokenApi = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)

    if (!accessToken || accessToken === null) {
        return null
    }

    return willExpireToken(accessToken) ? null : accessToken
}

export const getRefreshTokenApi = () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN)

    if (!refreshToken || refreshToken === null) {
        return null
    }

    return willExpireToken(refreshToken) ? null : refreshToken
}

const willExpireToken = token => {
    const seconds = 60
    const metaToken = jwtDecode(token)
    const { exp } = metaToken
    const now = (Date.now() + seconds) / 1000
    // const now = (moment().add(seconds, 'seconds').unix())
    
    return now > exp
}

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
}

export const refreshAccessTokenApi = refreshToken => {
    const url = `${basePath}/${apiVersion}/refresh-access-token`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refreshToken })
    }

    fetch(url, params)
        .then(response => {
            if(response.status !== 200)
                return null
            return response.json()
        })
        .then(result => {
            if (!result) {
                logout()
                return
            }
            const { accessToken, refreshToken } = result.tokens

            localStorage.setItem(ACCESS_TOKEN, accessToken)
            localStorage.setItem(REFRESH_TOKEN, refreshToken)
        })
}