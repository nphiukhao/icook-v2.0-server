const express = require('express')
const AuthService = require('../services/auth-service')

const authRouter = express.Router() 
const jsonParser = express.json()

authRouter
    .route('/auth/login')
    .post(jsonParser, (req, res, next) => {
        const { user_name, password } = req.body
        const loginUser = { user_name, password}

    

        for (const [key, value] of Object.entries(loginUser))
            if(value == null)
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                })
        AuthService.getUserByUserName(
            req.app.get('db'), 
            loginUser.user_name
        )
            .then(dbuser => {
                if(!dbuser){
                    return res.status(400).json({
                        error: 'Incorrect username or password'
                    })
                }
                return AuthService.comparePasswords(loginUser.password, dbuser.password)
                    .then(compareMatch => {
                        if(!compareMatch){
                            return res.status(400).json({
                                error: 'Incorrect username or password'
                            })
                        }
                        const subject = dbuser.user_name
                        const payload = {user_id: dbuser.id }

                        res.send({
                            authToken: AuthService.createJwt(subject, payload)
                        })
                    })
            })
            .catch(next)
    })
module.exports = authRouter