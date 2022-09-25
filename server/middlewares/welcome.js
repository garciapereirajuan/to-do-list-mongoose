const User = require('../models/user')
const Task = require('../models/task')
const Category = require('../models/category')
const { add } = require('../controllers/categoryAndTasks')
const CategoryController = require('../controllers/category')
const TaskController = require('../controllers/task')
const moment = require('moment')
const mongoose = require('mongoose')

module.exports = {
    welcome: (req, res, next) => {
        const { userId } = req.body
        console.log(userId)
        
        if (userId) {
            User.findByIdAndUpdate(userId, { initial: false }, async (err, user) => {
                if (err || !user) {
                    console.log('Ocurrió un error en el MD Welcome' , {err})
                    next()
                } 
                if (user.initial) {
                    await createCategoryDevelopment(userId)
                    await createTasksDevelopment(userId)
                    next()
                } else {
                    next()
                }
            })
        }
        if (!userId) {
            next()
        }
    }
}

const createCategoryDevelopment = (user) => {
    return new Promise((resolveFinish, reject) => {
        const createCategory = (data, funResolveFinish) => {
            return new Promise((resolve, reject) => {
                const req = { body: data }
                const res = false
                const funcResolve = () => {
                    resolve()
                    funcResolveFinish && funcResolveFinish()
                }
                CategoryController.create(req, res, funcResolve)
            })
        }

        const data1 = {
            title: 'Casa',
            color: '#FF6B3B',
            dateUp: new Date(),
            dateUpdate: new Date(),
            author: user,
        }

        const data2 = { ...data1, title: 'Trabajo', color: '#626681'}
        const data3 = { ...data1, title: 'Salud y Ejercicio', color: '#1D9ED1'}

        const funcResolveFinish = () => {
            resolveFinish()
        }

        createCategory(data1)
        createCategory(data2)
        createCategory(data3, funcResolveFinish)
    })  
}

const createTasksDevelopment = async (user) => {
    const createTask = (data, categoryName) => {
        return new Promise((resolve, reject) => {
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

                        console.log('Tareas creada correctamente.', { task: taskStored })

                        // console.log(author)
                        Category.find({ author, title: categoryName }, (err, category) => {
                            if (err || category.length === 0 || categoryName === null) {
                                resolve()
                                return
                            }
                            // console.log(category)
                            const req = { body: { taskId: taskStored._id }, params: { categoryId: category[0]._id }}
                            const res = false
                            // console.log(req)
                            const funcResolve = () => {
                                resolve()
                            }
                            add(req, res, funcResolve) 
                        })
                    })
                })
            }) 
        })
    }

    const data1 = {
        title: 'Cortar pasto',
        author: user,
        checked: false,
        dateUp: moment().subtract(10, 'minutes'),
        dateUpdate: moment().subtract(10, 'minutes'),
        dateDown: null,
        // dateDown: moment().subtract(10, 'days'),
        orderByDateDown: moment().add(10, 'years'),
        orderByCategory: `zzz999-${new Date().toISOString()}`
    }

    const data2 = { 
        ...data1, 
        title: 'Comprar mancuernas',
        dateUp: moment().subtract(2, 'hours'),
        dateDown: moment().add(5, 'days').add(2, 'hours').add(30, 'minutes'),
        timeDateDown: moment().add(5, 'days').add(2, 'hours').add(30, 'minutes'),
        orderByDateDown: moment().add(5, 'days').add(2, 'hours').add(30, 'minutes'),
        orderByCategory: 'Salud y Ejercicio'
    }
    const data3 = { 
        ...data1, 
        title: 'Ir a la peluquería',
        checked: true,
        dateUp: moment().subtract(35, 'days').subtract(4, 'hours').add(2, 'minutes'),
        dateDown: moment().subtract(25, 'days').subtract(2, 'hours').add(10, 'minutes'),
        timeDateDown: moment().subtract(25, 'days').subtract(2, 'hours').add(10, 'minutes'),
        dateComplete: moment().subtract(15, 'days').add(6, 'hours').add(20, 'minutes'),
        orderByDateDown: moment().subtract(25, 'days').subtract(2, 'hours').add(10, 'minutes'),
        orderByCategory: `zzz999-${new Date().toISOString()}`
    }   
    const data5 = { 
        ...data1, title: 
        'Arreglar la puerta',
        checked: true,
        dateUp: moment().subtract(10, 'days').add(3, 'hours').add(20, 'minutes'),
        dateDown: null,
        timeDateDown: null,
        dateComplete: moment().subtract(5, 'days').add(2, 'hours').add(12, 'minutes'),
        orderByDateDown: moment().add(10, 'years'),
        orderByCategory: 'Casa'
    }
    
    const data4 = { 
        ...data1, 
        title: 'Arreglar la ducha',
        dateUp: moment().subtract(2, 'days').add(6, 'hours').add(13, 'minutes'),
        dateDown: moment().add(1, 'days').subtract(10, 'hours').add(9, 'minutes'),
        timeDateDown: moment().add(1, 'days').subtract(10, 'hours').add(9, 'minutes'),        
        orderByDateDown: moment().add(1, 'days').subtract(10, 'hours').add(9, 'minutes'),
        orderByCategory: 'Casa'
    }
    const data6 = { 
        ...data1, 
        title: 'Comprar shampoo - Perro',
        dateUp: moment().subtract(4, 'days').add(24, 'minutes'),
        dateDown: null,
        timeDateDown: null,
        orderByDateDown: moment().add(10, 'years'),
        orderByCategory: `zzz999-${new Date().toISOString()}`
    }
    const data7 = { 
        ...data1, 
        title: 'Terminar el informe',
        dateUp: moment().subtract(1, 'days').add(4, 'hours').subtract(12, 'minutes'),
        dateDown: null,
        timeDateDown: null,
        orderByDateDown: moment().add(10, 'years'),
        orderByCategory: 'Trabajo'
    }
    const data8 = { 
        ...data1, 
        title: 'Comprar yerba 🧉',
        dateUp: moment().subtract(4, 'hours').add(2, 'minutes'),
        dateDown: moment().add(1, 'days').add(10, 'hours').add(4, 'minutes'),
        timeDateDown: moment().add(1, 'days').add(10, 'hours').add(4, 'minutes'),
        orderByDateDown: moment().add(1, 'days').add(10, 'hours').add(4, 'minutes'),
        orderByCategory: 'Casa'
    }
    const data9 = { 
        ...data1, 
        title: 'Comprar jabón 🚿',
        dateUp: moment().subtract(2, 'days').add(2, 'hours').add(5, 'minutes'),
        dateDown: moment().subtract(3, 'hours').add(46, 'minutes'),
        timeDateDown: moment().subtract(3, 'hours').add(46, 'minutes'),
        orderByDateDown: moment().subtract(3, 'hours').add(46, 'minutes'),
        orderByCategory: 'Casa'
    }

    let taskId = ''

    taskId = await createTask(data3, null)
    taskId = await createTask(data1, null)
    taskId = await createTask(data4, 'Casa')
    taskId = await createTask(data8, 'Casa')
    taskId = await createTask(data6, null)
    taskId = await createTask(data2, 'Salud y Ejercicio')
    taskId = await createTask(data5, 'Casa')
    taskId = await createTask(data9, 'Casa')
    taskId = await createTask(data7, 'Trabajo')
        
}