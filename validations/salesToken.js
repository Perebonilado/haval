const { check } = require("express-validator")

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
]


module.exports = { purchaseAssetWithTokenValidations }