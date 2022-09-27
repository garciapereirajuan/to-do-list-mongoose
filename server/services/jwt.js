const jwt = require('jwt-simple')
const moment = require('moment')

const SECRET_KEY = 'ckhn923nd9gJ56n2c5v18whsdfwg90X62bv6kbg8K'

exports.createAccessToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        createToken: moment().unix(),
        exp: moment().add(6, 'hours').unix(),
    }

    return jwt.encode(payload, SECRET_KEY)
}

exports.createRefreshToken = (user) => {
    const payload = {
        id: user._id,
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, SECRET_KEY)
}

exports.decodeToken = (token) => {
    return jwt.decode(token, SECRET_KEY, true)
}