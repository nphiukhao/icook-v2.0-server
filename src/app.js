require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const allRouter = require('./routers/all-filter-router')
const addRouter = require('./routers/add-recipe-router')
const recipeRouter = require('./routers/recipe-router')
const timeRouter = require('./routers/time-filter-router')
const authRouter = require('./routers/auth-router')
const ingredRouter = require('./routers/ingred-filter-router')
const deleteRoute = require('./routers/delete-recipe')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use(authRouter)
app.use(allRouter)
app.use(addRouter)
app.use(recipeRouter)
app.use(timeRouter)
app.use(ingredRouter)
app.use(deleteRoute)


app.use(function errorHandler(error, req, res, next) {

  console.log(error)
    let response

    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
         console.error(error)
         response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app