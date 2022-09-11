const User = require('../models/user')
const {message} = require('../utils')
const jwt = require('../services/jwt')
const moment = require('moment')

const willExpireToken = token => {
    const { exp } = jwt.decodeToken(token)
    const now = moment().unix()

    return now > exp
}

module.exports = {
    refreshAccessToken: (req, res) => {
        const { refreshToken } = req.body
        const ifTokenExpired = willExpireToken(refreshToken)
        
        if (ifTokenExpired) {
            message(res, 404, 'El refreshToken ha expirado.')
            return
        }
        
        const { id } = jwt.decodeToken(refreshToken)
        User.findOne({ _id: id }, (err, userStored) => {
            if (err) {
                message(res, 500, 'Error del servidor')
                return
            }
            if (!userStored) {
                message(res, 404, 'Usuario no encontrado.')
                return
            }
            if (userStored) {
                console.log('Se actualizó el accessToken')
                message(res, 200, '', { 
                    tokens: {
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    }
                })
            }
        })
    }
}