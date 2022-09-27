const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const md_auth = require('../middlewares/authenticated')

router.route('/user')
    .post(UserController.create)

router.route('/user/:id')
    .get([md_auth.ensureAuth], UserController.show)
    .put([md_auth.ensureAuth], UserController.update)
    .delete([md_auth.ensureAuth], UserController.delete)

router.route('/login')
    .post(UserController.login)

module.exports = router