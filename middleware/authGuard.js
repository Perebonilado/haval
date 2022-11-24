const ash = require("express-async-handler")
const { decodeToken } = require("../utils/lib/generateToken")

const authGuard = ash(async (req, res, next) => {
    try {
        if(req.headers && req.headers.authorization.startsWith("Bearer")){
            const token = req.headers.authorization.split(" ")[1]
            if(token){
                const userId = decodeToken(token)
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