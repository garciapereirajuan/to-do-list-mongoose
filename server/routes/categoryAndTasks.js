const express = require('express')
const router = express.Router()
const CategoryAndTasksController = require('../controllers/categoryAndTasks')
const md_auth = require('../middlewares/authenticated')

router.route('/category-and-tasks/:id')
    .post([md_auth.ensureAuth], CategoryAndTasksController.add)

module.exports = router