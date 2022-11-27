const express = require("express");
const router = express.Router();
const { authGuard } = require("../middleware/authGuard");
const {
  getBanksList,
  verifyBankAccountNumber,
  createCustomer,
  fetchCustomer
} = require("../controllers/paystack");

router.get("/get-banks-list", getBanksList);

router.get("/verify-account-number", verifyBankAccountNumber);

router.post("/create-customer", authGuard, createCustomer);

router.get("/fetch-customer", authGuard, fetchCustomer);

module.exports = router;
