const { check } = require("express-validator");

const uploadMerchantsBookValidations = [
  check("title")
    .not()
    .isEmpty()
    .withMessage({ message: "book title is a required field" }),
  check("author")
    .not()
    .isEmpty()
    .withMessage({ message: "book author is a required field" }),
  check("bookUrl")
    .not()
    .isEmpty()
    .withMessage({ message: "book url is a required field" }),
  check("coverImageUrl")
    .not()
    .isEmpty()
    .withMessage({ message: "cover image url is a required field" }),
  check("releaseDate")
    .not()
    .isEmpty()
    .withMessage({ message: "release date is a required field" }),
  check("amount")
    .not()
    .isEmpty()
    .withMessage({ message: "amount is a required field" }),
  check("genre")
    .not()
    .isEmpty()
    .withMessage({ message: "genre is a required field" }),
  check("description")
    .not()
    .isEmpty()
    .withMessage({ message: "description is a required field" }),
];

module.exports = { uploadMerchantsBookValidations };
