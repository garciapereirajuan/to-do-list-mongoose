import { basePath, apiVersion } from './config'

export const welcomeApi = (token, userId) => {
    const url = `${basePath}/${apiVersion}/welcome/${userId}`
    const params = {
        method: 'GET',
        headers : {
            'Content-Type': 'application/json',
            Authorization: token
        }
    }

    return fetch(url, params) 
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}
