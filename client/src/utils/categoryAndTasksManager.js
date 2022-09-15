/*
    *** MODO DE USO *** 

    * Para actualizar la categoría de una tarea: 
    *   - updateCategoryAndTasks(token, taskId, newCategoryId, oldCategory, setReloadCategories)
    * 
    * Para solamente agregar una categoría a una tarea: 
    *   - updateCategoryAndTasks(token, taskId, newCategoryId, null, setReloadCategories)    
    * 
    * Para solamente eliminar una categoría a una tarea:
    *   - updateCategoryAndTasks(token, taskId, null, oldCategoryId, setReloadCategories)
    
    * NOTA: Si taskId es un array entra en un bucle asyncrono que permite enviar peticiones
            a medida que se vaya obteniendo repuesta de la petición anterior
*/

import { 
    addCategoryAndTasksApi, 
    removeCategoryAndTasksApi
} from '../api/categoryAndTasks'
import { notification } from 'antd'
import { verifyExpireTokenInWeb } from '../api/auth'

export const updateCategoryAndTasks = (token, taskId, newCategoryId, oldCategoryId, msj, finish) => {

    if (verifyExpireTokenInWeb()) {
        notification['info']({
            message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
            duration: 20,
        })
        return
    }

    if (!token || !taskId || !finish) {
        // console.log('Token, taskId, y la función "finish" son requeridos.')
        notification['info']({ message: 'Sólo puedes mover las tareas. 😀'})
        return
    }

    const update = (unique, taskId, newCategoryId, oldCategoryId) => {
        // token y finish lo recibe de la función padre
        return new Promise((res, rej) => {
            const add = async () => {
                if (newCategoryId) {
                    await addCategoryAndTasksManager(
                        unique,
                        token,
                        taskId,
                        newCategoryId,
                        oldCategoryId,
                        msj,
                        finish
                    ).then(response => response.code === 200 && res(response))
                } else {
                    finish()
                }
            }

            const remove = async () => {
                //al final ejecuto la función add (para que sea asicrono)
                await removeCategoryAndTasksManager(
                    token, 
                    taskId, 
                    oldCategoryId
                )
                .then(response => {
                    if (response?.code === 200 && newCategoryId) {
                        add()
                        return
                    }
                    if (response?.code === 200 && !newCategoryId) {
                        res(response)
                        finish()
                    }
                })
            }

            if (oldCategoryId) {
                remove()
            }

            !oldCategoryId && add() //withoutOldCategory
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

                const item = taskId[i]
                const itemArray = item.split('-')
                itemTaskId = itemArray[0] 
                itemOldCategoryId = itemArray[1] !== 'no_category' ? itemArray[1] : null

            } else {
                console.log('Entra acá porque es un objeto')
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

        // const  funcAsync = async () => {
        //     setTimeout(() => {
        //         const item = taskId[i]
        //         const itemArray = item.split('-')
        //         const itemTaskId = itemArray[0] 
        //         const itemOldCategoryId = itemArray[1] !== 'no_category' ? itemArray[1] : null 
        //         console.log('En el forEach es: ', itemArray, 'Y: ', itemTaskId, itemOldCategoryId)
        //         // console.log(itemArray, itemTaskId, itemOldCategoryId)
        //         update(itemTaskId, newCategoryId, itemOldCategoryId)
        //         // console.log(item); 

        //         i++;
        //         i < length && funcAsync()

        //         if (i === length) {
        //             setTimeout(() => {
        //                 setReloadCategories(true)
        //                 setReloadTasks(true) 
        //                 setIsVisibleModal(false)
        //             }, 200)
        //         }
        //     }, 200)
        // }




        // taskId.forEach( async item => {
        //     const itemArray = item.split('-')
        //     const itemTaskId = itemArray[0] 
        //     const itemOldCategoryId = itemArray[1] !== 'no_category' ? itemArray[1] : null 
        //     console.log('En el forEach es: ', itemArray, 'Y: ', itemTaskId, itemOldCategoryId)
        //     // console.log(itemArray, itemTaskId, itemOldCategoryId)
        //     await update(itemTaskId, newCategoryId, itemOldCategoryId)
        // })
        // return
    // })   
}

const addCategoryAndTasksManager = (unique, token, taskId, categoryId, oldCategoryId, msj, finish) => {

    // console.log('agregó taskID: ', JSON.stringify(taskId))
        
    return new Promise((res, rej) => {
        addCategoryAndTasksApi(token, taskId, categoryId)
            .then(response => {
                if (/token/g.test(response.message)) {
                    notification['info']({
                        message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                        duration: 20,
                    })
                    return
                }
                if (response?.code !== 200 || !response.code) {
                    notification['error']({
                        message: response.message
                    })
                    return
                }
                if (msj) {
                    notification['success']({ message: response.message })
                }
                if (!oldCategoryId || unique) {
                    finish()
                }
                // fromRemove && resolve({ ok: true })
                res(response)
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error. Intenta más tarde.' })
            })
    })
}

const removeCategoryAndTasksManager = (token, taskId, oldCategoryId, add) => {
    return new Promise ((res, rej) => {
        removeCategoryAndTasksApi(token, taskId, oldCategoryId)
            .then(response => {
                if (/token/g.test(response.message)) {
                    notification['info']({
                        message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                        duration: 20,
                    })
                    return
                }
                if (response?.code !== 200 || !response.code) {
                    console.log('Error: ' + JSON.stringify(response))
                    return
                }
                res(response)
                // add && add(true) //add recibe fromRemove para saber si se ejecuta desde acá
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error. Intenta más tarde.' })
            })
    })
}