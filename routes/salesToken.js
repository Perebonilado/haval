const express = require("express");
const router = express.Router();
const {
  generateBookSalesToken,
  purchaseAssetWithToken,
  sendTokenViaEmail,
  getUnusedTokens
} = require("../controllers/salesToken");
const {
  purchaseAssetWithTokenValidations,
  sendTokenViaEmailValidation,
  getUnusedTokensValidations
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

router.get(
  "/get-unused-tokens",
  authGuard,
  ...getUnusedTokensValidations,
  getUnusedTokens
)

module.exports = router;
