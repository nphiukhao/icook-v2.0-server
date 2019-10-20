const express = require('express')
const recipeRouter = express.Router()
const AllRouterService = require('../services/all-recipe-service')
const requireAuth = require('../jwt-auth/jwt-auth')


recipeRouter
    .route('/recipe/:id')
    .get((req, res, next) => {
        id = req.params.id
        console.log('getting recipe by id:', id)
        AllRouterService.getIngredById(req.app.get('db'), id)
            .then(ingredients => res.json(ingredients))
            .catch(next)
    })
    .delete()
    

module.exports = recipeRouter