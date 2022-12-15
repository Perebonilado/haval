const express = require("express");
const router = express.Router();
const { addBook, getAllUsersBooks, getUsersBookById, deleteUsersBook,  } = require("../controllers/book");
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

router.get("/retrieve-all", authGuard, getAllUsersBooks);

router.get("/retrieve-one/:bookId", authGuard, getUsersBookById);

router.delete("/delete/:bookId", authGuard, deleteUsersBook)

module.exports = router;
