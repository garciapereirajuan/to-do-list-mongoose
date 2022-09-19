const Category = require('../models/category')
const User = require('../models/user')
const { message } = require('../utils')

module.exports = {
    create: (req, res) => {
        const data = req.body
        const category = new Category(data)

        if (category.color === '0') {
            category.color = null
        }

        if (!data.title) {
            message(res, 404, 'El título de la categoría es requerido.')
            return
        }
        if (!data.author) {
            message(res, 404, 'El autor de la categoría es requerido.')
            return
        }
        
        Category.find({ author: data.author }, (err, categories) => {
            if (err) {
                console.log('Error al encontrar las categorías')
            }
            if (!categories) {
                
            }
            const matchTitle = categories.filter(item => item.title === data.title)
            if (matchTitle.length !== 0) {
                message(res, 404, 'El nombre de la categoría ya existe.', {err})
                return
            }
            const matchColor = categories.filter(item => item.color && item.color === data.color)
            if (matchColor.length !== 0) {
                message(res, 404, 'El color está siendo usado por otra cateogría.', {err})
                return
            }
            category.save((err, category) => {
                if (!category) {
                    message(res, 500, 'Se produjo un error al guardar la categoría.')
                    return
                }
                if (!category) {
                    message(res, 500, 'Se produjo un error al guardar la categoría.')
                    return
                }
    
                User.findOne({ _id: data.author }, (err, user) => {
                    if (err) {
                        message(res, 404, 'El autor no existe.', { err })
                        return
                    }
                    
                    let categories = user.categories
                    categories.push(category._id) 
    
                    User.findByIdAndUpdate(data.author, { categories }, (err, user) => {
                        if (err || !user) {
                            message(res, 500, 'Se produjo un error interno, intente más tarde.')
                            return
                        }
    
                        message(res, 200, 'Categoría creada correctamente.', { category: category})
                    })
    
                })
                
            })
        })
    },
    index: (req, res) => {
        const { id } = req.params

        Category.find({ author: id }).populate('tasks').then((categories) => {
            if (categories.length === 0) {
                message(res, 404, 'No se encontró ninguna categoría.')
                return
            }
            if (categories) {
                message(res, 200, '', { categories })
            }
        })
    },
    update: (req, res) => {
        const { id } = req.params
        const data = req.body

        if (data.color === '0') {
            data.color = null
        }

        Category.find({ author: data.author }, (err, categories) => {
            if (err) {
                message(res, 500, 'Se produjo un error al actualizar la categoría.', {err})
                return
            } 
            if (!categories) { 
                message(res, 404, 'Se produjo un error al actualizar la categoría.')
                return
            }
            const matchTitle = categories.filter(item => (
                item.title === data.title && item._id != data._id)
            )
            if (matchTitle.length !== 0) {
                message(res, 404, 'El nombre de la categoría ya existe.', {err})
                return
            }
            const matchColor = categories.filter(item => (
                item.color && (item.color === data.color && item._id != data._id)
            ))
            if (matchColor.length !== 0) {
                message(res, 404, 'El color está siendo usado por otra cateogría.', {err})
                return
            }

            Category.findByIdAndUpdate(id, data, (err, category) => {
                if (err) {
                    message(res, 500, 'Se produjo un error al actualizar la categoría.', {err})
                    return
                } 
                if (!category) { 
                    message(res, 404, 'Se produjo un error al actualizar la categoría.')
                    return
                }
    
                message(res, 200, 'Categoria actualizada correctamente.')
            })
        })
    },
    delete: (req, res) => {
        const { id } = req.params
        
        Category.findByIdAndDelete(id, (err, category) => {
            if (err) {
                message(res, 500, 'Se produjo un error al eliminar la categoría.', {err})
                return
            }
            if (!category) {
                message(res, 404, 'Esta categoría ya no existe.')
                return
            }
            
            message(res, 200, 'Categoría eliminada correctamente.')
        })
    }
}

const createCategoryDevelopment = (user) => {
    const createCategory = (data) => {
        const category = new Category(data)

        if (category.color === '0') {
            category.color = null
        }

        if (!data.title) {
            console.log('El título de la categoría es requerido.')
            return
        }
        if (!data.author) {
            console.log('El autor de la categoría es requerido.')
            return
        }
        
        Category.find({ author: data.author }, (err, categories) => {
            if (err) {
                console.log('Error al encontrar las categorías')
            }
            if (!categories) {
                
            }
            const matchTitle = categories.filter(item => item.title === data.title)
            if (matchTitle.length !== 0) {
                console.log('El nombre de la categoría ya existe.', {err})
                return
            }
            const matchColor = categories.filter(item => item.color && item.color === data.color)
            if (matchColor.length !== 0) {
                console.log('El color está siendo usado por otra cateogría.', {err})
                return
            }
            category.save((err, category) => {
                if (!category) {
                    console.log('Se produjo un error al guardar la categoría.')
                    return
                }
                if (!category) {
                    console.log('Se produjo un error al guardar la categoría.')
                    return
                }
    
                User.findOne({ _id: data.author }, (err, user) => {
                    if (err) {
                        console.log('El autor no existe.', { err })
                        return
                    }
                    
                    let categories = user.categories
                    categories.push(category._id) 
    
                    User.findByIdAndUpdate(data.author, { categories }, (err, user) => {
                        if (err || !user) {
                            console.log('Se produjo un error interno, intente más tarde.')
                            return
                        }
    
                        console.log('Categoría creada correctamente.', { category: category})
                    })
    
                })
                
            })
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
    const data3 = { ...data1, title: 'Salud', color: '#1D9ED1'}
    const data4 = { ...data1, title: 'Patio', color: '#9FB40F'}
    const data5 = { ...data1, title: 'Ejercicio', color: '#B1ABF4'}
    const data6 = { ...data1, title: 'Estética', color: '#F383A2'}

    createCategory(data1)
    createCategory(data2)
    createCategory(data3)
    createCategory(data4)
    createCategory(data5)
    createCategory(data6)
}

// createCategoryDevelopment('63247aad2e89489e9ca9ab16')