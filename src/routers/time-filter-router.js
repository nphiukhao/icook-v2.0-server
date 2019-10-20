const express = require('express')
const timeRouter = express.Router() 
const AllRecipeService = require('../services/all-recipe-service')
const requireAuth = require('../jwt-auth/jwt-auth')


timeRouter
    .route('/time/:limit')
    .get((req, res, next) => {
        let limit = req.params.limit
        AllRecipeService.getRecipeByTime(req.app.get('db'), limit)
            .then(result => res.json(result))
            .catch(next)
      
    })

module.exports = timeRouter