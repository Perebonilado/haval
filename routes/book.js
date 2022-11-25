const express = require("express");
const router = express.Router();
const { addBook } = require("../controllers/book");
const { authGuard } = require("../middleware/authGuard");
const { uploadBook } = require("../config/multer");
const { addBookValidations } = require("../validations/book");

router.post(
  "/add",
  authGuard,
  ...addBookValidations,
  uploadBook.single("book"),
  addBook
);

module.exports = router;
