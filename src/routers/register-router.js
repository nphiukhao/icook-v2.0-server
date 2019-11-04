const express = require('express')
const registerRouter = express.Router()
const jsonParser = express.json()
const AuthService = require('../services/auth-service')

registerRouter
    .route('/register')
    .post(jsonParser, (req, res, next) => {
        const { user_name, password } = req.body
        const newUser = { user_name, password }

        const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

        for (const [key, value] of Object.entries(newUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                })

        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password must be longer than 8 characters',
            })
        }
        if (password.length > 72) {
            return res.status(400).json({
                error: 'Password must be less than 72 characters',
            })
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return res.status(400).json({
                error: 'Password must not start or end with empty spaces',
            })
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return res.status(400).json({
                error: 'Password must contain 1 upper case, lower case, number and special character',
            })
        }
        AuthService.userNameExists(req.app.get('db'), user_name)
            .then(result => {
                if(result){
                    return res.status(400).json({ error: `Username already taken` })
                }
            
                    
                    return AuthService.hashPassword(password)
                        .then(hash => {
                            let preppedNewUser = {
                                user_name,
                                password: hash
                            }
                            AuthService.saveUser(req.app.get('db'), preppedNewUser)
                                .then(user => {
                                    res.send({ regMessage: 'Registration complete! Please login with your new Username and Password.'})
                                })
                        })
                
            })

    })



module.exports = registerRouter