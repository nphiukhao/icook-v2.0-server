const express = require('express')
const addRouter = express.Router()
const jsonParser = express.json()
const AllRecipeService = require('../services/all-recipe-service')

addRouter
    .route('/add')
    .post(jsonParser, (req, res, next) => {
        const { title, minutes, ingredient, instructions } = req.body
        const newRecipe = { title, minutes, instructions}

        for (const [key, value] of Object.entries(newRecipe))
        if (value == null)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          })

        AllRecipeService.inserNewRecipe(req.app.get('db'), newRecipe)
            .then(recipe => {
 
                const recipe_id = recipe[0].id
                let ingredientArray = ingredient.split(',')
          
                ingredientArray = ingredientArray.map(ingredient => {
                    return {
                        name: ingredient.trim().toLowerCase(),
                        recipe_id: recipe_id
                    }
                })


                AllRecipeService.inserNewIngredients(req.app.get('db'), ingredientArray, next)
                    .then(ings => {
                        res
                        .status(201)
                        .json({ recipe: recipe, ingredient: [...ings] })
                    })
            })
            .catch(next)
    })

module.exports = addRouter