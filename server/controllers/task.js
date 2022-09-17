const Task = require('../models/task')
const User = require('../models/user')
const { message } = require('../utils')

module.exports = {
    create: (req, res) => {
        const { title, author, dateUp, dateDown, order } = req.body

        if (!title || !author) {
            message(res, 404, 'El título y el autor son requeridos.')
            return
        }
        if (!dateUp) {
            message(res, 404, 'Las fechas de creación es requerida.')
            return
        }

        const task = new Task(req.body)

        User.findOne({ _id: author }, (err, userStored) => {
            if (err || !userStored) {
                message(res, 404, 'La tarea no puede ser creada porque no se reconoció al usuario.')
                return
            }

            task.save((err, taskStored) => {
                if (err?.code === 11000) {
                    message(res, 404, 'La propiedad "order" no se puede repetir.')
                    return
                }
                if (err) {
                    message(res, 404, 'Error en el servidor.', { err })
                    return
                }
                if (!taskStored) {
                    message(res, 500, 'Ocurrió un error inesperado.')
                    return
                }
                
                let tasks = userStored.tasks
                tasks.push(task._id)
        
                User.findByIdAndUpdate({ _id: author }, { tasks }, (err, userStored) => {
                    if (err || !userStored) {
                        message(res, 404, 'Error en el servidor.')
                        return  
                    }

                    message(res, 200, 'Tarea creada correctamente.', { task: taskStored })
                })
            })
        }) 
    },
    index: (req, res) => {
        const { page = 1, limit = 8, checked = false } = req.query
        const { userId, pagination = true } = req.body

        if (pagination === false) {
            indexWithoutPagination(req, res)
            return
        }

        User.findOne({ _id: userId }, (err, user) => {
            if (err) {
                message(res, 500, 'Se produjo un error interno.')
                return
            }
            if (!user) {
                message(res, 404, 'Necesitas registrarte para obtener tus tareas.')
                return
            }

            const options = {
                page,
                limit: parseInt(limit),
                sort: user.sort
            }

            Task.paginate({ author: userId, checked: checked }, options, (err, tasks) => {
                if (err) {
                    message(res, 500, 'Error del servidor.')
                    return
                }
                if (!tasks) {
                    message(res, 404, 'No se encontró ninguna tarea')
                    return
                }
                if (tasks) {
                    message(res, 200, '', { tasks: tasks })
                }
            })
        })
    },
    update: (req, res) => {
        const { id } = req.params
        const data = req.body
        
        Task.findByIdAndUpdate(id, data, (err, taskUpdated) => {
            if (err?.name === 'CastError') {
                message(res, 404, 'La tarea que intentas actualizar no existe.')
                return
            }
            if (err) {
                message(res, 500, 'Se produjo un error.', {err})
                return
            }
            if (!taskUpdated) {
                message(res, 404, 'La tarea que intentas actualizar no existe.')
                return
            }
            
            message(res, 200, 'Tarea actualizada correctamente.')
        })
    },
    delete: (req, res) => {
        const { id } = req.params

        Task.findOne({_id: id}).populate('author').then((task) => {
            if (!task) {
                message(res, 404, 'Se produjo un error interno.')
                return
            } 
            
            let tasks = task.author.tasks
            let index = tasks.findIndex(element => element == id)
            
            tasks.splice(index, index === 0 ? 1 : index)

            User.findByIdAndUpdate(task.author, { tasks }, (err, userStored) => {
                if (err) {
                    message(res, 500, 'Se produjo un error interno.')
                    return
                }
                if (!userStored) {
                    message(res, 404, 'El autor de esta tarea no existe.')
                }
                if (userStored) {
                    Task.findByIdAndDelete(id, (err, taskDeleted) => {
                        if (err) {
                            message(res, 500, 'Se produjo un error interno.')
                            return
                        }

                        message(res, 200, 'Tarea eliminada correctamente.')
                    })
                }
            })
        })
    }
}

const indexWithoutPagination = (req, res) => {
    // const { checked = false } = req.query
    const { userId } = req.body

    User.findOne({ _id: userId }, (err, user) => {
        if (err) {
            message(res, 500, 'Se produjo un error interno.')
            return
        }
        if (!user) {
            message(res, 404, 'Necesitas registrarte para obtener tus tareas.')
            return
        }

        Task.find({ author: userId }, (err, tasks) => {
            if (err) {
                message(res, 500, 'Error del servidor.')
                return
            }
            if (!tasks) {
                message(res, 404, 'No se encontró ninguna tarea')
                return
            }
            if (tasks) {
                message(res, 200, '', { tasks: tasks })
            }
        })
    })
}

const createTasksDevelopment = (user) => {
    const createTask = (data) => {
        const { title, author, dateUp, dateDown, order } = data
    
        if (!title || !author) {
            console.log('El título y el autor son requeridos.')
            return
        }
        if (!dateUp) {
            console.log('Las fechas de creación es requerida.')
            return
        }
    
        const task = new Task(data)
    
        User.findOne({ _id: author }, (err, userStored) => {
            if (err || !userStored) {
                console.log('La tarea no puede ser creada porque no se reconoció al usuario.')
                return
            }
    
            task.save((err, taskStored) => {
                if (err?.code === 11000) {
                    console.log('La propiedad "order" no se puede repetir.')
                    return
                }
                if (err) {
                    console.log('Error en el servidor.', { err })
                    return
                }
                if (!taskStored) {
                    console.log('Ocurrió un error inesperado.')
                    return
                }
                
                let tasks = userStored.tasks
                tasks.push(task._id)
        
                User.findByIdAndUpdate({ _id: author }, { tasks }, (err, userStored) => {
                    if (err || !userStored) {
                        console.log('Error en el servidor.')
                        return  
                    }
    
                    console.log('Tarea creada correctamente.', { task: taskStored })
                })
            })
        }) 
    }

    const data1 = {
        title: 'Cortar pasto',
        author: user,
        checked: false,
        dateUp: new Date().toISOString(),
        dateDown: null,
        dateUpdate: new Date().toISOString(),
        category: null,
    }

    const data2 = { ...data1, title: 'Salir a correr'}
    const data3 = { ...data1, title: 'Ir a la peluquería'}
    const data4 = { ...data1, title: 'Limpiar el baño'}
    const data5 = { ...data1, title: 'Limpiar la pieza'}
    const data6 = { ...data1, title: 'Lavar ropa'}
    const data7 = { ...data1, title: 'Podar las plantas'}
    const data8 = { ...data1, title: 'Comprar foco'}
    const data9 = { ...data1, title: 'Comprar jabón'}

    createTask(data1)
    createTask(data2)
    createTask(data3)
    createTask(data4)
    createTask(data5)
    createTask(data6)
    createTask(data7)
    createTask(data8)
    createTask(data9)
}

// createTasksDevelopment('63247aad2e89489e9ca9ab16')

