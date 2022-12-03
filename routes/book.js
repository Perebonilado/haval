const express = require("express");
const router = express.Router();
const { addBook, getAllMerchantsBooks, getMerchantsBookById, deleteMerchantsBook,  } = require("../controllers/book");
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

router.get("/retrieve-all", authGuard, getAllMerchantsBooks);

router.get("/retrieve-one/:bookId", authGuard, getMerchantsBookById);

router.delete("/delete/:bookId", authGuard, deleteMerchantsBook)

module.exports = router;
