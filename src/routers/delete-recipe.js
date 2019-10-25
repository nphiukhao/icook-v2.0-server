const express = require('express')
const deleteRoute = express.Router()
const AllRecipeService = require('../services/all-recipe-service')


deleteRoute 
    .route('/delete/:id')
    .delete((req, res, next) => {
        
        let id = req.params.id 

        AllRecipeService.getRecipeById(req.app.get('db'), id)
            .then( result => {
                if(!result) {
                    return res.status(400).json({
                        error: 'Could not find id'
                    })
                }

                AllRecipeService.deleteRecipe(req.app.get('db'), id)
                .then(
                    result => AllRecipeService.deleteIngredient(req.app.get('db'), id)
                )
                .then(after => res.status(200))
                .catch(next)
            })
            .catch(next)
    })

module.exports = deleteRoute