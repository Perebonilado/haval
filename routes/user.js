const express = require("express");
const router = express.Router();
const { getUserInformation } = require("../controllers/user");
const { authGuard } = require("../middleware/authGuard");

router.get("/profile-info", authGuard, getUserInformation);

module.exports = router;
