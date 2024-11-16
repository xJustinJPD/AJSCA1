const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')

const register = (req, res) => {
    let newUser = new User(req.body)
    newUser.password = bcrypt.hashSync(req.body.password, 10)

    newUser.save()
            .then(data => {
                data.password = undefined
                return res.status(201).json(data)
            })
            .catch(err => {
                res.status(400).json({
                    message : err
                })
            })
    
}
const login = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user || !user.ComparePassword(req.body.password)){
                req.status(401).json({
                    message : 'Auth failed'
                })
            }

            return res.status(200).json({
                token: jwt.sign({
                    email: user.email,
                    full_name: user.full_name,
                    _id: user._id,
                    role: "admin"
                }, process.env.JWT_SECRET)
            })
        })
        .catch(err => {
            req.status(500).json({
                message : err
            })
        })
}


const loginRequired = (req, res, next) => {
    if(req.user.role === "admin"){
        next()
    }
    else{
        return res.status(401).json({
            message : 'Unauthorized user'
        })
    }
}

module.exports = {
    register,
    login,
    loginRequired
}