import { basePath, apiVersion } from './config'

export const indexTaskApi = (token, page, limit, complete, userId, sort) => {
    const url = `${basePath}/${apiVersion}/tasks?page=${page}&limit=${limit}&complete=${complete}`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify({ userId: userId, sort: sort })
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const createTaskApi = (token, taskData) => {
    console.log(taskData)
    const url = `${basePath}/${apiVersion}/task`
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: JSON.stringify(taskData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const updateTaskApi = (token, taskId, taskData) => {
    const url = `${basePath}/${apiVersion}/task/${taskId}`
    const params = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify(taskData)
    }

    return fetch(url, params)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}

export const deleteTaskApi = (token, taskId) => {

    const url = `${basePath}/${apiVersion}/task/${taskId}`
    const parmas = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }
    }

    return fetch(url, parmas)
        .then(response => response.json())
        .then(result => result)
        .catch(err => err)
}