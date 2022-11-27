const { check } = require("express-validator")

const verifyBankAccountNumberValidations = [
    check("account_number")
    .not()
    .isEmpty()
    .withMessage({ message: "account number is a required field" }),
    check("bank_code")
    .not()
    .isEmpty()
    .withMessage({ message: "bank code is a required field" }),
]


module.exports = { verifyBankAccountNumberValidations }