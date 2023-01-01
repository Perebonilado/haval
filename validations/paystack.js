const { body } = require("express-validator");

const createDedicatedVirtualAccountValidations = [
  body("customerId")
    .not()
    .isEmpty()
    .withMessage({ message: "customer Id is a required field" }),
];

const initializeTransactionValidations = [
  body("amount")
    .not()
    .isEmpty()
    .withMessage({ message: "amount is a required field" }),
  body("initiator")
    .not()
    .isEmpty()
    .withMessage({ message: "Initiator is a required field" }),
];

const createTransferRecipientValidations = [
  body("name")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide recipient name" }),
  body("account_number")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide recipient account number" }),
  body("bank_code")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provider bank code" }),
];

const initiateTransferValidations = [
  body("recipient")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide a valid recipient" }),
  body("amount")
    .not()
    .isEmpty()
    .withMessage({ message: "Please Provide amount" }),
  body("reason")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide reason for initiating transfer" }),
];

const finalizeTransferValidations = [
  body("transfer_code")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide transfer code" }),
  body("otp")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide a valid otp" }),
];

module.exports = {
  createDedicatedVirtualAccountValidations,
  initializeTransactionValidations,
  createTransferRecipientValidations,
  initiateTransferValidations,
  finalizeTransferValidations
};
