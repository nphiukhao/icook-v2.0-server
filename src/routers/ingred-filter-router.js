const express = require('express')
const ingredRouter = express.Router()
const jsonParser = express.json()
const AllRecipeService = require('../services/all-recipe-service')

ingredRouter
    .route('/ingred')
    .post(jsonParser,(req, res, next) => {
        let ingred = req.body.map(item => `'${item}'`).join()

        AllRecipeService.getMatch(req.app.get('db'), ingred)
            .then(result => res.json(result.rows[0]))
            
            .catch(next)
        
    })

    module.exports = ingredRouter