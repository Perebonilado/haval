const ash = require("express-async-handler")
const { decodeJwtToken } = require("../utils/lib/generateJwtToken")

const authGuard = ash(async (req, res, next) => {
    try {
        if(!req.headers.authorization) res.status(400).json({message: "No bearer token passed in header"})
        else if(req.headers.authorization.startsWith("Bearer")){
            const token = req.headers.authorization.split(" ")[1]
            if(token){
                const userId = decodeJwtToken(token)
                if(userId) {
                    req.user = userId
                    next()
                }
                else res.status(400).json({message: "please, provide a valid user id"})
            }
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = { authGuard }