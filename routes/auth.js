const express = require("express")
const router = express.Router()


router.get("/login", (req, res)=>{
    res.status(200).json({message: "you are logged in"})
})


module.exports = router