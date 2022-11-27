const express = require("express")
const router = express.Router()
const { confirmPaymentWebHook } = require("../webhooks/paystack")

// paystack
router.post('/paystack', confirmPaymentWebHook)


module.exports = router