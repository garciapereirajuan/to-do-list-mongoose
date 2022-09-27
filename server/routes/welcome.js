const express = require('express')
const router = express.Router()
const WelcomeController = require('../controllers/welcome')
const md_auth = require('../middlewares/authenticated')

router.get('/welcome/:id', [md_auth.ensureAuth], WelcomeController.welcome)

module.exports = router