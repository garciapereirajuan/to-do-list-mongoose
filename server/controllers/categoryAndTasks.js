const Task = require('../models/task')
const Category = require('../models/category')
const { message } = require('../utils')

module.exports = {
    add: (req, res) => {
        const { id } = req.params
        const { taskId } = req.body

        if (!id || !taskId) {
            message(res, 404, 'El Id de la categoría y de la tarea es obligatorio.')
            return
        }

        Task.findByIdAndUpdate(taskId, { category: id }, (err, task) => {
            if (err?.name === 'CastError' || !task) {
                message(res, 404, 'La tarea no se ha encontrado.')
                return
            }
            if (err) {
                message(res, 500, 'Se produjo un error.', {err})
                return
            }

            Category.findOne({ _id: id }, (err, category) => {
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

                Category.findByIdAndUpdate(id, { tasks }, (err, category) => {
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
}