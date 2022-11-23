const ash = require('express-async-handler')

const signUp = ash(async (req, res)=>{
    res.status(200).json({message: "you have signed up"})
})

const login = ash(async(req, res)=>{
    res.status(200).json({message: "you are logged in"})
})

module.exports = { signUp, login }