const express = require("express");
const router = express.Router();
const { login, signUp } = require("../controllers/auth");
const { uploadImage } = require("../config/multer");
const { signUpValidations, loginValidations } = require("../validations/auth");

router.post("/login", ...loginValidations, login);

router.post(
  "/signup",
  ...signUpValidations,
  uploadImage.single("image"),
  signUp
);

module.exports = router;
