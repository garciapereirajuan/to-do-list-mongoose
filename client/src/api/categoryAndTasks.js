import { basePath, apiVersion } from './config'

export const addCategoryAndTasksApi = (token, taskId, categoryId) => {
    const url = `${basePath}/${apiVersion}/category-and-tasks/${categoryId}`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ taskId: taskId })
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const removeCategoryAndTasksApi = (token, taskId, categoryId) => {
    const url = `${basePath}/${apiVersion}/category-and-tasks/${categoryId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ taskId: taskId })
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}