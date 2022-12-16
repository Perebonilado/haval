const express = require("express");
const router = express.Router();
const { uploadMerchantBook, getAllMerchantsBooks, getMerchantsBookById, deleteMerchantsBook,  } = require("../controllers/book");
const { authGuard } = require("../middleware/authGuard");
const { uploadBookDetails } = require("../config/multer");
const { uploadMerchantsBookValidations } = require("../validations/book");

router.post(
  "/upload-book",
  authGuard,
  ...uploadMerchantsBookValidations,
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
  uploadMerchantBook
);

router.get("/retrieve-all-merchant-books", authGuard, getAllMerchantsBooks);

router.get("/retrieve-one-merchant-book/:bookId", authGuard, getMerchantsBookById);

router.delete("/delete-merchant-book/:bookId", authGuard, deleteMerchantsBook)

module.exports = router;
