const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/category')
const md_auth = require('../middlewares/authenticated')

router.route('/category')
    .post([md_auth.ensureAuth], CategoryController.create)

router.route('/category/:id')
    .put([md_auth.ensureAuth], CategoryController.update)

router.route('/categories/:id')
    .get([md_auth.ensureAuth], CategoryController.index)


module.exports = router