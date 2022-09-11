const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/task')
const md_auth = require('../middlewares/authenticated')

router.route('/task')
    .post([md_auth.ensureAuth], TaskController.create)

router.route('/task/:id')
    .delete([md_auth.ensureAuth], TaskController.delete)
    .put([md_auth.ensureAuth], TaskController.update)

router.route('/tasks')
    .post([md_auth.ensureAuth], TaskController.index)


module.exports = router