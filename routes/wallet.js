const express = require("express");
const router = express.Router();
const { authGuard } = require("../middleware/authGuard");
const { getWallets } = require("../controllers/wallet");

router.get("/get-wallets", authGuard, getWallets);

module.exports = router;
