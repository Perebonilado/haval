const express = require("express")
const router = express.Router()
const { generateBookSalesToken } = require("../controllers/salesToken")
const { authGuard } = require("../middleware/authGuard")



router.post("/generate/:bookId", authGuard, generateBookSalesToken)





module.exports = router