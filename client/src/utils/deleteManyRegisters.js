import { getAccessTokenApi } from '../api/auth'
import { deleteTaskApi } from '../api/task'
// import { deleteCategoryApi } from '../api/category'
import { openNotification } from './openNotification'
import { updateCategoryAndTasks } from './categoryAndTasksManager'

export const deleteManyTasks = (array, msj, nextFunction) => {
    const token = getAccessTokenApi()
    let i = 0

    const loopAsync = async () => {
        await deleteTaskApi(token, array[i]._id)
            .then(response => {
                if (/token/g.test(response.message)) {
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    i = 10000
                    return
                }
                if (response?.code !== 200) {
                    openNotification('error', response.message)
                    i++
                    return
                }
                if (array[i].category) {
                    updateCategoryAndTasks(
                        token, 
                        array[i]._id, 
                        null, 
                        array[i].category, 
                        false, 
                        () => {}
                    )
                }
                // openNotification('success', response.message)
                i++
                if (i === array.length) {
                    nextFunction && nextFunction()
                    msj && openNotification('success', msj)
                }
            })
        i < array.length && loopAsync()
    }
    loopAsync()
}

// PARA EL FUTURO

// export const deleteManyCategories = (array, msj, nextFunction) => {
//     const token = getAccessTokenApi()
//     let i = 0

//     const loopAsync = async () => {
//         await deleteCategoryApi(token, array[i]._id)
//             .then(response => {
//                 if (/token/g.test(response.message)) {
//                     openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
//                     i = 10000
//                     return
//                 }
//                 if (response?.code !== 200) {
//                     openNotification('error', response.message)
//                     i++
//                     return
//                 }
//                 if (array[i].tasks) {
//                     updateCategoryAndTasks(
//                         token, 
//                         array[i].tasks, 
//                         null, 
//                         array[i].category, 
//                         false, 
//                         () => {}
//                     )
//                 }
//                 // notification['success']({ message: response.message })
//                 i++
//                 if (i === array.length) {
//                     nextFunction && nextFunction()
//                     msj && openNotification('success', msj)
//                 }
//             })
//         i < array.length && loopAsync()
//     }
//     loopAsync()
// }