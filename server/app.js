const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Configure Header HTTP
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
  })

// Utils
const { API_VERSION } = require('./config')
const md_welcome = require('./middlewares/welcome')

// Load routes
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/task')
const categoryRoutes = require('./routes/category')
const categoryAndTasksRoutes = require('./routes/categoryAndTasks')

// Routes basic
app.use(`/api/${API_VERSION}`, userRoutes)
app.use(md_welcome.welcome)
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, taskRoutes)
app.use(`/api/${API_VERSION}`, categoryRoutes)
app.use(`/api/${API_VERSION}`, categoryAndTasksRoutes)

module.exports = app