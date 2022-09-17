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