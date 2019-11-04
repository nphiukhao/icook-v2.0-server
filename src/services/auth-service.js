const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserByUserName(db, user_name){

        return db('users')
            .where({user_name})
            .first()
    },
    comparePasswords(password, hash){
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    },
    verifyJwt(token){
        return jwt.verify(token, config.JWT_SECRET, {
          algorithms: ['HS256'],
        })
    },
    userNameExists(db, username){
        return db
            .from('users')
            .select('user_name')
            .where('user_name', username)
            .first()
    },
    hashPassword(password){
        return bcrypt.hash(password, 12)
    },
    saveUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
    }
        
}

module.exports = AuthService