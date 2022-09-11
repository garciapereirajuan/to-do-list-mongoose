const User = require('../models/user')
const {message} = require('../utils')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

module.exports = {
    create: (req, res) => {
        const user = new User()
        const { username, password, repeatPassword } = req.body

        if (!username || !password || !repeatPassword) {
            message(res, 404, 'Debes enviar el nombre de usuario, la contraseña y repetir contraseña.')
            return
        }
        user.username = username.toLowerCase()

        if (password !== repeatPassword) {
            message(res, 404, 'Las contraseñas deben coincidir.')
            return
        }
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) {
                message(res, 500, 'Error al encriptar la contraseña.')
                return
            }
            user.password = hash
            user._id = new mongoose.Types.ObjectId()
            user.sort = { order: 'desc' }
            
            user.save((err, userStored) => {
                if (err?.code === 11000) {
                    message(res, 404, 'El nombre de usuario ya está en uso, pruba con otro.')
                    return
                }
                if (err) {
                    message(res, 500, 'Se produjo un error.', { error: err })
                    return
                }
                if (!userStored) {
                    message(res, 404, 'El nombre de usuario ya está en uso, pruba con otro.')
                    return
                }
                if (userStored) {
                    message(res, 200, 'Te has registrado correctamente.', { user: userStored})
                }                    
            })
            
        }) 
    },
    login: (req, res) => {
        let { username, password } = req.body
        
        if (!username || !password) {
            message(res, 404, 'El nombre de usuario y la contraseña son requeridos.')
            return
        }
        username = username.toLowerCase()

        User.findOne({ username }, (err, userStored) => {
            if (err) {
                message(res, 500, 'Error en el servidor.', { error: err})
                return
            }
            if (!userStored) {
                message(res, 404, 'Usuario no encontrado.')
                return
            }
            
            bcrypt.compare(password, userStored.password, (err, check) => {
                if (err) {
                    message(res, 500, 'Error del servidor.')
                    return
                }
                if (!check) {
                    message(res, 404, 'Contraseña incorrecta.')
                    return
                }
                if (check) {
                    message(res, 200, '', { 
                        tokens: {
                            accessToken: jwt.createAccessToken(userStored),
                            refreshToken: jwt.createRefreshToken(userStored)
                        }
                    })
                }
            })
            
        })
    },
    show: (req, res) => {
        const { id } = req.params

        User.findById(id).populate('tasks').exec((err, tasks) => {
            res.send({tasks})
        })

        // User.findById(id, (err, user) => {
        //     if (err) {
        //         message(res, 404, 'El usuario que intentas encontrar no existe.')
        //     } else {
        //         if (!user) {
        //             message(res, 404, 'El usuario que intentas encontrar no existe.')
        //         } else {
        //             message(res, 200, '', { user })
        //         }
        //     }
        // })
    },
    update: (req, res) => {
        const { id } = req.params
        const data = req.body

        function updateUser(){
            User.findByIdAndUpdate(id, req.body, (err, userStored) => {
                if (err) {
                    if (err.codeName === "DuplicateKey")
                        message(res, 404, 'Ese nombre de usuario ya está en uso, prueba otro.')
                    else {
                        message(res, 404, 'El usuario que intentas actualizar no existe.')
                    }
                } else {
                    if (!userStored) {
                        message(res, 404, 'Ese nombre de usuario ya está en uso, prueba otro.')
                    } else {
                        message(res, 200, 'El usuario ha sido actualizado.', { user: userStored })
                    }
                }
            })
        }

        if (data.password || data.repeatPassword) {
            if (data.password !== data.repeatPassword) {
                message(res, 404, 'Las contraseñas deben coincidir.')
            } else {
                bcrypt.hash(password, null, null, (err, hash) => {
                    if (err) {
                        message(res, 500, 'Error al encriptar la contraseña.')
                    } else {
                        data.password = hash
                        updateUser()
                    }
                })
            }
        } else {
            if (data.username) {
                data.username = data.username.toLowerCase()
            }
            updateUser()
        }
    },
    delete: (req, res) => {
        const { id } = req.params

        User.findByIdAndDelete(id, (err, user) => {
            if (err) {
                message(res, 500, 'Error interno, inténtalo más tarde.')
            } else {
                if (!user) {
                    message(res, 404, 'El usuario que intentas eliminar no existe.')
                } else {
                    message(res, 200, `El usuario "${user.username}" ha sido eliminado.`)
                }
            }
        })
    },
}

