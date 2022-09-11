const Task = require('../models/task')
const Category = require('../models/category')
const { message } = require('../utils')

const add = (req, res) => {
    const { categoryId } = req.params
    const { taskId } = req.body

    if (!categoryId || !taskId) {
        message(res, 404, 'El Id de la categoría y de la tarea es obligatorio.')
        return
    }

    Task.findByIdAndUpdate(taskId, { category: categoryId }, (err, task) => {
        if (err?.name === 'CastError' || !task) {
            message(res, 404, 'La tarea no se ha encontrado.')
            return
        }
        if (err) {
            message(res, 500, 'Se produjo un error.', {err})
            return
        }

        Category.findOne({ _id: categoryId }, (err, category) => {
            if (err) {
                message(res, 500, 'Se produjo un error.', {err})
                return
            }
            if (!category) {
                message(res, 404, 'La categoría no se ha encontrado.')
                return
            }

            let tasks = category.tasks
            tasks.push(taskId)

            Category.findByIdAndUpdate(categoryId, { tasks }, (err, category) => {
                if (err) {
                    message(res, 500, 'Se produjo un error.', {err})
                    return
                }
                if (!category) {
                    message(res, 404, 'La categoría no se ha encontrado.')
                    return
                }
                
                message(res, 200, `Tarea agregada a categoría "${category.title}"`)
            })
        })
    })
}

const remove = (req, res) => {
    const { categoryId } = req.params
    const { taskId } = req.body

    if (!categoryId || !taskId) {
        message(res, 404, 'El Id de la tarea y de la categoría es requerido.')
        return
    }

    Category.findOne({ _id: categoryId }, (err, category) => {
        if (err) {
            message(res, 500, 'Se produjo un error.', { err })
            return
        }
        if (!category) {
            message(res, 404, 'La categoría que intentas actualizar no existe.')
            return
        }

        let tasks = category.tasks
        let index = tasks.findIndex(item => item == taskId)

        tasks.splice(index, index === 0 ? 1 : index)

        if (index === -1) {
            message(res, 404, 'La tarea no existe o no está asociada a esta categoría.')
            return
        }

        Category.findByIdAndUpdate(categoryId, { tasks }, (err, category) => {
            if (err) {
                message(res, 500, 'Se produjo un error.', { err })
                return
            }
            if (!category) {
                message(res, 404, 'La categoría que intentas actualizar no existe.')
                return
            }

            Task.findByIdAndUpdate(taskId, { category: null }, (err, category) => {
                if (err) {
                    message(res, 500, 'Se produjo un error.')
                    return
                }
                if (!category) {
                    message(res, 404, 'La tarea que intentas actualizar no existe.')
                    return
                }

                message(res, 200, 'Tarea actualizada correctamente.')
            })
        })
    })
}

module.exports = {
    add,
    remove

        // Task.findByIdAndUpdate(taskId, { category: newCategoryId }, (err, task) => {
        //     if (err) {
        //         message(res, 500, 'Se produjo un error.', { err })
        //         return
        //     }
        //     if (!task) {
        //         message(res, 404, 'La tarea que intentas actualizar no existe.')
        //         return
        //     }

        //     removeTaskIdOfOldCategory()
        // })
}