const { check } = require("express-validator");

const signUpValidations = [
  check("email")
    .isEmail()
    .withMessage({ message: "please provide a valide email address" })
    .not()
    .isEmpty()
    .withMessage({ message: "email is a required field" }),
  check("password")
    .isLength({ min: 5 })
    .withMessage({ message: "Must be a minimum of 5 characters" })
    .not()
    .isEmpty()
    .withMessage({ message: "email is a required field" }),
  check("username")
    .not()
    .isEmpty()
    .withMessage({ message: "username is a required field" }),
  check("firstName")
    .not()
    .isEmpty()
    .withMessage({ message: "firstName is a required field" }),
  check("lastName")
    .not()
    .isEmpty()
    .withMessage({ message: "lastName is a required field" }),
];

module.exports = { signUpValidations };
