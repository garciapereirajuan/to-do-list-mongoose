const jwt = require('../services/jwt')
const moment = require('moment')
const { message } = require('../utils')

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return message(res, 403, 'La petición no tiene cabecera de autenticación.')
    }

    const token = req.headers.authorization.replace(/["']+g/, '')

    try {
        var payload = jwt.decodeToken(token)
        if (payload.exp <= moment().unix()) {
            return message(res, 404, 'El token ha caducado.')
        }
    } catch (ex) {
        return message(res, 404, 'El token es inválido.')
    }

    req.user = payload
    next()
}

