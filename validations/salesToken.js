const { check } = require("express-validator");

const purchaseAssetWithTokenValidations = [
  check("asset_id")
    .not()
    .isEmpty()
    .withMessage({ message: "asset id is a required field" }),
  check("asset_type")
    .not()
    .isEmpty()
    .withMessage({ message: "asset type is a required field" }),
  check("token")
    .not()
    .isEmpty()
    .withMessage({ message: "token is a required field" }),
];

const sendTokenViaEmailValidation = [
  check("email")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide a valid email" })
    .isEmail()
    .withMessage({ message: "Invalid email address" }),
  check("token")
    .not()
    .isEmpty()
    .withMessage({ message: "Please provide a token to be sent" }),
  check("assetName").not().isEmpty(),
];

module.exports = {
  purchaseAssetWithTokenValidations,
  sendTokenViaEmailValidation,
};
