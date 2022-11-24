const express = require("express");
const router = express.Router();
const { login, signUp } = require("../controllers/auth");
const { uploadImage } = require("../config/multer");
const { signUpValidations } = require("../validations/auth");

router.post("/login", login);

router.post(
  "/signup",
  uploadImage.single("image"),
  ...signUpValidations,
  signUp
);

module.exports = router;
