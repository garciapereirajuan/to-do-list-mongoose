const Category = require('../models/category')
const User = require('../models/user')
const { message } = require('../utils')

module.exports = {
    create: (req, res) => {
        const data = req.body
        const category = new Category(data)

        if (!data.title) {
            message(res, 404, 'El título de la categoría es requerido.')
            return
        }
        if (!data.author) {
            message(res, 404, 'El autor de la categoría es requerido.')
            return
        }
        category.save((err, category) => {
            if (err) {
                message(res, 404, 'El nombre de la categoría ya existe.', {err})
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
        
        Category.findByIdAndUpdate(id, data, (err, category) => {
            if (err) {
                message(res, 404, 'El nombre de la categoría ya existe.', {err})
                return
            } 
            if (!category) {
                message(res, 404, 'El nombre de la categoría ya existe.')
                return
            }

            message(res, 200, 'Categoria actualizada correctamente.')
        })
    }
}