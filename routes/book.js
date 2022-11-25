const express = require("express");
const router = express.Router();
const { addBook } = require("../controllers/book");
const { authGuard } = require("../middleware/authGuard");
const { uploadBookDetails, uploadImage } = require("../config/multer");
const { addBookValidations } = require("../validations/book");

router.post(
  "/add",
  authGuard,
  ...addBookValidations,
  uploadBookDetails.fields([
    {
      name: "book",
      maxCount: 1,
    },
    {
      name: "book_cover",
      maxCount: 1,
    },
  ]),
  addBook
);

module.exports = router;
