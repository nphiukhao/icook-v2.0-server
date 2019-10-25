const express = require('express')
const recipeRouter = express.Router()
const AllRecipeService = require('../services/all-recipe-service')
const jsonParser = express.json()


recipeRouter
    .route('/recipe/:id')
    .get((req, res, next) => {
        id = req.params.id
        AllRecipeService.getIngredById(req.app.get('db'), id)
            .then(ingredients => res.json(ingredients))
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        let id = req.params.id
        let newMins = req.body.newMinutes
        AllRecipeService.updateMinutes(req.app.get('db'), id, newMins)
        .then(after => res.status(200))
        .catch(next)
    })
    
module.exports = recipeRouter