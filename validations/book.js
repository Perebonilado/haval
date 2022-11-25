const { body } = require("express-validator");

const addBookValidations = [
  body("title")
    .not()
    .isEmpty()
    .withMessage({ message: "book title is a required field" }),
  body("author")
    .not()
    .isEmpty()
    .withMessage({ message: "book author is a required field" }),
  body("bookUrl")
    .not()
    .isEmpty()
    .withMessage({ message: "book url is a required field" }),
  body("coverImageUrl")
    .not()
    .isEmpty()
    .withMessage({ message: "cover image url is a required field" }),
  body("user")
    .not()
    .isEmpty()
    .withMessage({ message: "user is a required field" }),
  body("releaseDate")
    .not()
    .isEmpty()
    .withMessage({ message: "release date is a required field" }),
  body("amount")
    .not()
    .isEmpty()
    .withMessage({ message: "amount is a required field" }),
  body("genre")
    .not()
    .isEmpty()
    .withMessage({ message: "genre is a required field" }),
  body("description")
    .not()
    .isEmpty()
    .withMessage({ message: "description is a required field" }),
];

module.exports = { addBookValidations };
