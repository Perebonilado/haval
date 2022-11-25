const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require("../constants")

const generateJwtToken = (userId) => {
    const token = jwt.sign({id: userId}, PRIVATE_KEY, { expiresIn: "3h"})

    if(token) return token
    return null
}  

const decodeJwtToken = (token) => {
    const { id: userId } = jwt.verify(token, PRIVATE_KEY)
    return userId
}

module.exports = { generateJwtToken, decodeJwtToken }