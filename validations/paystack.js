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
    .withMessage({ message: "amount is a required field" })
];

module.exports = { createDedicatedVirtualAccountValidations, initializeTransactionValidations };
