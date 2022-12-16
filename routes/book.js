const express = require("express");
const router = express.Router();
const {
  uploadMerchantBook,
  getAllMerchantsBooks,
  getMerchantsBookById,
  deleteMerchantsBookById,
  getAllCustomersBooks,
  deleteCustomerBookById,
  searchBookByTitle
} = require("../controllers/book");
const { authGuard } = require("../middleware/authGuard");
const { uploadBookDetails } = require("../config/multer");
const { uploadMerchantsBookValidations } = require("../validations/book");

// general

router.get("/search-books", authGuard, searchBookByTitle)

// merchants 

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

router.get(
  "/retrieve-one-merchant-book/:bookId",
  authGuard,
  getMerchantsBookById
);

router.delete("/delete-merchant-book/:bookId", authGuard, deleteMerchantsBookById);

// customer

router.get("/retrieve-all-customer-books", authGuard, getAllCustomersBooks)

router.delete("/delete-customer-book/:bookId", authGuard, deleteCustomerBookById)

module.exports = router;
