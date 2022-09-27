import { basePath, apiVersion } from './config'

export const createUserApi = (userData) => {
    const url = `${basePath}/${apiVersion}/user`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }

    return fetch(url, params) 
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const loginUserApi = (userData) => {
    const url = `${basePath}/${apiVersion}/login`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateUserApi = (token, userId, userData) => {
    const url = `${basePath}/${apiVersion}/user/${userId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify(userData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const showUserApi = (token, userId) => {
    const url = `${basePath}/${apiVersion}/user/${userId}`
    const params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }
    }

    return fetch(url, params) 
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}