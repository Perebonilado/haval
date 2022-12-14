const express = require("express");
const router = express.Router();
const { authGuard } = require("../middleware/authGuard");
const {
  getBanksList,
  verifyBankAccountNumber,
  createCustomer,
  fetchCustomer,
  createDedicatedVirtualAccount,
  initalizeTransaction,
  createTransferRecipient,
  initiateTransfer,
  finalizeTransfer,
} = require("../controllers/paystack");

const {
  createDedicatedVirtualAccountValidations,
  initializeTransactionValidations,
  createTransferRecipientValidations,
  initiateTransferValidations,
  finalizeTransferValidations,
} = require("../validations/paystack");

router.get("/get-banks-list", authGuard, getBanksList);

router.get("/verify-account-number", authGuard, verifyBankAccountNumber);

router.post("/create-customer", authGuard, createCustomer);

router.get("/fetch-customer", authGuard, fetchCustomer);

router.post(
  "/create-dva",
  authGuard,
  ...createDedicatedVirtualAccountValidations,
  createDedicatedVirtualAccount
);

router.post(
  "/initialize-transaction",
  authGuard,
  ...initializeTransactionValidations,
  initalizeTransaction
);

router.post(
  "/create-transfer-recipient",
  authGuard,
  ...createTransferRecipientValidations,
  createTransferRecipient
);

router.post(
  "/initiate-transfer",
  authGuard,
  ...initiateTransferValidations,
  initiateTransfer
);

router.post(
  "/finalize-transfer",
  authGuard,
  ...finalizeTransferValidations,
  finalizeTransfer
);

module.exports = router;
