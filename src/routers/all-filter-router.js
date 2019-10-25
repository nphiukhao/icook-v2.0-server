const express = require('express')
const allRouter = express.Router()
const { requireAuth } = require('../jwt-auth/jwt-auth')
const AllRecipeService = require('../services/all-recipe-service')

allRouter
  .route('/all')
  .all(requireAuth)
  .get((req, res, next) => {
    AllRecipeService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        res.json(AllRecipeService.serializeRecipes(recipes))
      })
      .catch(next)
  })

    module.exports = allRouter