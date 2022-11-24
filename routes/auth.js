const express = require("express");
const router = express.Router();
const { login, signUp } = require("../controllers/auth");
const { uploadImage } = require("../config/multer");
const { signUpValidations, loginValidations } = require("../validations/auth");
const { authGuard } = require("../middleware/authGuard");

router.post("/login", ...loginValidations, login);

router.post(
  "/signup",
  uploadImage.single("image"),
  ...signUpValidations,
  signUp
);

module.exports = router;
