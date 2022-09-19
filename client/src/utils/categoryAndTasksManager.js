import { addCategoryAndTasksApi, removeCategoryAndTasksApi } from '../api/categoryAndTasks'
import { openNotification } from './openNotification'
import { verifyExpireTokenInWeb } from '../api/auth'

/*
    *** MODO DE USO *** 

    * Para actualizar la categoría de una tarea (o más tareas taskId=[array]): 
    *   - updateCategoryAndTasks(token, taskId, newCategoryId, oldCategory, msj, finish)
    * 
    * Para agregar una categoría a una tarea (o más tareas taskId=[array]) que
      no tenía categoría: 
    *   - updateCategoryAndTasks(token, taskId, newCategoryId, null, msj, finish)    
    * 
    * Para solamente eliminar la categoría de una tarea (o más tareas taskId=[array]):
    *   - updateCategoryAndTasks(token, taskId, null, oldCategoryId, msj, finish)
    
    * msj = true - muestra notificación
    * finish - función que se ejecuta cuando termina de realizar todas las peticiones.
    * si finish = (() => {}) - entonces no ejecuta nada.  
    
    * NOTA: La ventaja de la función finish es que se ejecuta de manera asíncrona, luego
            de haber hecho todas las peticiones. (Un ejemplo de esto está en la función 
            deleteCategory, dentro de Categories.jsx)
    
    * NOTA: Si taskId es un array entra en un bucle asíncrono que permite enviar peticiones
            a medida que se vaya obteniendo repuesta de la petición anterior

*/

export const updateCategoryAndTasks = (token, taskId, newCategoryId, oldCategoryId, msj, finish) => {

    if (verifyExpireTokenInWeb()) {
        openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
        return
    }

    if (!token || !taskId || !finish) {
        // console.log('Token, taskId, y la función "finish" son requeridos.')
        openNotification('info', 'Sólo puedes mover las tareas. 😀')
        return
    }

    const update = (unique, taskId, newCategoryId, oldCategoryId) => {
        // token y finish lo recibe de la función padre
        return new Promise((res, rej) => {
            const add = async () => {
                if (newCategoryId) {
                    await addCategoryAndTasksManager(
                        unique, token, taskId, newCategoryId, 
                        oldCategoryId, msj, finish
                    ).then(response => {
                        response.code === 200 && res(response)
                    })
                } else {
                    finish()
                }
            }

            const remove = async () => {
                await removeCategoryAndTasksManager(token, taskId, oldCategoryId)
                    .then(response => {
                        if (response?.code === 200 && newCategoryId) {
                            add()
                            return
                        }
                        if (response?.code === 200 && !newCategoryId) {
                            if (typeof taskId === 'object') {
                                console.log('Entra acá porque es array')
                                res(response)
                                return
                            }
                            res(response)
                            // finish()
                        }
                    })
            }

            if (oldCategoryId) {
                remove()
            }

            !oldCategoryId && add()
        })
    }

    if (typeof taskId === 'string') {
        let unique = true
        update(unique, taskId, newCategoryId, oldCategoryId)
        return
    }

    if (typeof taskId === 'object') {
        let unique = false
        let length = taskId.length
        let i = 0

        const  bucleAsync = async () => { 
            let itemTaskId = ''
            let itemOldCategoryId = ''

            if (typeof taskId[i] === 'string') {
                // console.log('Entra acá porque es un string')
                const item = taskId[i]
                const itemArray = item.split('-')
                itemTaskId = itemArray[0] 
                itemOldCategoryId = itemArray[1] !== 'no_category' ? itemArray[1] : null

            } else {
                // console.log('Entra acá porque es un objeto')
                itemTaskId = taskId[i]._id
                itemOldCategoryId = oldCategoryId

            }

            await update(unique, itemTaskId, newCategoryId, itemOldCategoryId)
                .then(response => {
                    i++
                    if (i === length) {
                        finish()
                    }
                })

            i < length && bucleAsync()
        }
        bucleAsync()    
    }
}

const addCategoryAndTasksManager = (unique, token, taskId, categoryId, oldCategoryId, msj, finish) => {
        
    return new Promise((res, rej) => {
        addCategoryAndTasksApi(token, taskId, categoryId)
            .then(response => {
                if (/token/g.test(response.message)) {
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    return
                }
                if (response?.code !== 200 || !response.code) {
                    openNotification('error', response.message)
                    return
                }
                if (msj) {
                    openNotification('success', response.message)
                }
                if (!oldCategoryId || unique) {
                    finish()
                }
                res(response)
            })
            .catch(err => {
                openNotification('error', 'Se produjo un error. Intenta más tarde.')
            })
    })
}

const removeCategoryAndTasksManager = (token, taskId, oldCategoryId) => {

    return new Promise ((res, rej) => {
        removeCategoryAndTasksApi(token, taskId, oldCategoryId)
            .then(response => {
                if (/token/g.test(response.message)) {
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    return
                }
                if (response?.code !== 200 || !response.code) {
                    console.log('Error: ' + JSON.stringify(response))
                    return
                }
                res(response)
            })
            .catch(err => {
                openNotification('error', 'Se produjo un error, intenta más tarde.' )
            })
    })
}