import { basePath, apiVersion } from './config'

export const indexCategoriesApi = (token, userId) => {
    const url = `${basePath}/${apiVersion}/categories/${userId}`
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