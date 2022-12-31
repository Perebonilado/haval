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

module.exports = {
  createDedicatedVirtualAccountValidations,
  initializeTransactionValidations,
  createTransferRecipientValidations
};
