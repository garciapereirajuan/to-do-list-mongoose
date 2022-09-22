const express = require('express')
const router = express.Router()
const CategoryAndTasksController = require('../controllers/categoryAndTasks')
const md_auth = require('../middlewares/authenticated')

router.route('/category-and-tasks/:categoryId')
    .post([md_auth.ensureAuth], CategoryAndTasksController.add)
    .put([md_auth.ensureAuth], CategoryAndTasksController.update) //actualiza el array 'tasks'

module.exports = router