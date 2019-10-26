require('dotenv').config()
const express = require('express')
// const cors = require('cors')
const morgan = require('morgan')
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

// app.use(cors())
app.use(morgan(morganOption))
app.use(helmet())

app.use(authRouter)
app.use(allRouter)
app.use(addRouter)
app.use(recipeRouter)
app.use(timeRouter)
app.use(ingredRouter)
app.use(deleteRoute)


app.use(function errorHandler(error, req, res, next) {
  
  res.header("Access-Control-Allow-Origin", 'icook.nphiukhao.now.sh'); 
  res.header("Access-Control-Allow-Credentials", true); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); 
  res.header("Access-Control-Allow-Headers", 
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');


  console.log(error)
    let response

    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' },
      "Access-Control-Allow-Origin": 'https://icook.nphiukhao.now.sh',

    
    }
    } else {
         console.error(error)
         response = { message: error.message, 
          error,
          "Access-Control-Allow-Origin": 'https://icook.nphiukhao.now.sh' }
    }
    res.status(500).json(response)
    })

module.exports = app