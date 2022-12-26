const express = require("express");
const router = express.Router();
const {
  generateBookSalesToken,
  purchaseAssetWithToken,
  sendTokenViaEmail,
} = require("../controllers/salesToken");
const {
  purchaseAssetWithTokenValidations,
  sendTokenViaEmailValidation,
} = require("../validations/salesToken");
const { authGuard } = require("../middleware/authGuard");

router.post("/generate/:bookId", authGuard, generateBookSalesToken);
router.post(
  "/purchase-asset",
  authGuard,
  ...purchaseAssetWithTokenValidations,
  purchaseAssetWithToken
);
router.post(
  "/send-token-email",
  authGuard,
  ...sendTokenViaEmailValidation,
  sendTokenViaEmail
);

module.exports = router;
