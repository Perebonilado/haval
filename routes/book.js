const express = require("express");
const router = express.Router();
const { addBook, getAllUserBooks, getUserBookById, deleteUserBook } = require("../controllers/book");
const { authGuard } = require("../middleware/authGuard");
const { uploadBookDetails } = require("../config/multer");
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

router.get("/retrieve-all", authGuard, getAllUserBooks);

router.get("/retrieve-one/:bookId", authGuard, getUserBookById);

router.delete("/delete/:bookId", authGuard, deleteUserBook)

module.exports = router;
