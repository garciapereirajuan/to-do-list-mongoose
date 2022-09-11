const message = (res, status, message, obj) => {
    if (!obj) {
        res.status(status).send({ code: status, message: message})
    } else {
        let key = Object.keys(obj)[0]
        
        if (message === '')
            res.status(status).send({ code: status, [key]: obj[key] })
        else 
            res.status(status).send({ code: status, message: message, [key]: obj[key] })
    }
}

module.exports = { message }