const express = require("express");
const router = express.Router();
const {
  generateBookSalesToken,
  purchaseAssetWithToken,
} = require("../controllers/salesToken");
const {
  purchaseAssetWithTokenValidations,
} = require("../validations/salesToken");
const { authGuard } = require("../middleware/authGuard");

router.post("/generate/:bookId", authGuard, generateBookSalesToken);
router.post(
  "/purchase-asset",
  authGuard,
  purchaseAssetWithTokenValidations,
  purchaseAssetWithToken
);

module.exports = router;
