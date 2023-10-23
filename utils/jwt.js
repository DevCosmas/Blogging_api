const jwt = require('jsonwebtoken')

async function jwtToken(payload) {
    const token = await jwt.sign({ id: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
    return token
}

module.exports = { jwtToken }