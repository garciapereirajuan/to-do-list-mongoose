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
                
                message(res, 200, `Tarea agregada a la categoría "${category.title}"`)
            })
        })
    })
}

const update = (req, res) => {
    const { categoryId } = req.params
    const { taskId, position } = req.body

    if (position === null) {
        console.log('Position es null')
        changeCategory(req, res)
        return
    }

    if (!position) {
        console.log('error !position', position)
        // message(res, 404, 'Error!!!!')
        return
    }

    Category.findOne({ _id: categoryId }, (err, category) => {
        if (err) {
            message(res, 500, 'Se produjo un error.', { err })
            return
        } 
        if (!category) {
            message(res, 404, 'No se encontró la categoría.')
            return
        }
        
        let tasks = category.tasks

        if (tasks.length !== 0) {
            let string  = tasks.toString()
            tasks = string.replace(taskId, '').split(',').filter(Boolean)
            tasks.splice(position, 0, taskId)
            console.log(tasks)
        } else {
            tasks = []
        }

        Category.findByIdAndUpdate(categoryId, { tasks }, (err, category) => {
            if (err) {
                message(res, 500, 'Se produjo un error.', { err })
                return
            } 
            if (!category) {
                message(res, 404, 'No se encontró la categoría.')
                return
            }

            message(res, 200, 'Posición actualizada correctamente.')
        })
    })
}

//se ejecuta en 'update' si !position
const changeCategory = (req, res) => {

    const { categoryId } = req.params
    const { taskId } = req.body

    if (!taskId) {
        message(res, 404, 'Solo puedes mover las tareas.')
        return
    }

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

        // tasks.splice(index, index === 0 ? 1 : index)
        tasks = tasks.toString().replace(tasks[index], '').split(',').filter(Boolean)

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
    update
}