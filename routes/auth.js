const express = require("express")
const router = express.Router()
const { login, signUp } = require("../controllers/auth")
const { uploadImage } = require("../config/multer")


router.post("/login", login)

router.post("/signup", uploadImage.single("image"), signUp)


module.exports = router