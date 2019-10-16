const express = require('express')
const allRouter = express.Router()
const AllRecipeService = require('../services/all-recipe-service')

allRouter
  .route('/all')
  .get((req, res, next) => {
    AllRecipeService.getAllRecipes(req.app.get('db'))
      .then(things => {
        res.json(things)
      })
      .catch(next)
    
  })

    module.exports = allRouter