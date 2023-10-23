require('dotenv').config()
const jwt = require('jsonwebtoken')
const { userModel } = require('./../model/user')
const appError = require('./../utils/errohandler')
const sendEmail = require('./../utils/email')


const isAuthenticated = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            return token
        }
        if (req.cookies) var token = req.cookies.jwt
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const date = new Date
        const time = parseInt(date.getTime() / 1000)
        const user = await userModel.findById(decodedToken.id)

        if (user && decodedToken.iat < time)
            req.user = user

        return next()
    } catch (err) {
        next(new appError(err, 500))
    }
}
const isLoggedIn = async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return next(new appError('kindly login or sign up', 401))
        }
        else if (req.cookies.jwt) {
            const decodedToken = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
            const date = new Date
            const time = parseInt(date.getTime() / 1000)
            const user = await userModel.findById(decodedToken.id)

            if (user && decodedToken.iat < time)
                res.locals.user = user
            return next()
        }

        next()

    } catch (error) {
        next(new appError(err, 500))
    }

}


module.exports = { isAuthenticated, isLoggedIn}