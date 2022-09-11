const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth')

router.route('/refresh-access-token')
    .post(AuthController.refreshAccessToken)

module.exports = router