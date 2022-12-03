const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");
const { BookModel } = require("../models/Book");
const { MerchantModel } = require("../models/Merchant");
const mongoose = require("mongoose");

const addBook = ash(async (req, res) => {
  try {
    // validate request body, and continue if no errors
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      const { title, author, releaseDate, amount, genre, description } =
        req.body;
      const merchantId = req.user;

      if (!req.files)
        res.status(200).json({ message: "please upload book and book cover" });
      else if (req.files.book && req.files.book_cover) {
        const book = req.files.book[0].path;
        const book_cover = req.files.book_cover[0].path;

        try {
          const coverImageUrl = await cloudinary.uploader.upload(book_cover, {
            resource_type: "image",
          });

          const bookUrl = await cloudinary.uploader.upload(book);

          if (bookUrl && coverImageUrl) {
            if (new Date().getTime() < new Date(releaseDate).getTime()) {
              const createdBook = new BookModel({
                title: title,
                author: author,
                releaseDate: releaseDate,
                amount: amount,
                genre: genre,
                description: description,
                coverImageUrl: coverImageUrl.secure_url,
                bookUrl: bookUrl.secure_url,
                user: mongoose.Types.ObjectId(merchantId),
              });
              const savedBook = await createdBook.save();
              if (savedBook) {
                try {
                  await MerchantModel.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(merchantId) },
                    { $push: { books: savedBook._id } }
                  );
                  res
                    .status(200)
                    .json({ message: "Book successfully uploaded" });
                } catch (error) {
                  res.status(400).json({ message: error.message });
                }
              }
            } else {
              res
                .status(400)
                .json({ message: "Upload date must be a future date" });
            }
          }
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      } else
        res.status(400).json({ message: "please upload book and book cover" });
    } else res.status(400).json(errors.array()[0].msg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getAllMerchantsBooks = ash(async (req, res) => {
  try {
    const merchantId = req.user;
    const mongoosemerchantId = mongoose.Types.ObjectId(merchantId);
    const merchantsBooks = await BookModel.find()
      .where("user")
      .equals(mongoosemerchantId);

    if (merchantsBooks)
      res.status(200).json({ message: "Success", data: merchantsBooks });
    else res.status(400).json({ message: "error getting books" });
  } catch (error) {
    res.status(400).json({ message: "error getting books" });
  }
});

const getMerchantsBookById = ash(async (req, res) => {
  try {
    const merchantId = req.user;
    const { bookId } = req.params;
    const mongoosemerchantId = mongoose.Types.ObjectId(merchantId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);
    const merchantsBook = await BookModel.find({
      user: mongoosemerchantId,
      _id: mongooseBookId,
    }).populate("user");

    if (merchantsBook) res.status(200).json({ message: "Success", data: merchantsBook });
    else res.status(400).json({ message: "book does not exist" });
  } catch (error) {
    res.status(400).json({ message: "error getting book" });
  }
});

const deleteMerchantsBook = ash(async (req, res) => {
  try {
    const merchantId = req.user;
    const { bookId } = req.params;
    const mongoosemerchantId = mongoose.Types.ObjectId(merchantId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);

    const deletedBook = await BookModel.findOneAndDelete({
      user: merchantId,
      _id: bookId,
    });
    if (deletedBook) {
      const removedBookFromMerchantsBooksArray = await MerchantModel.findOneAndUpdate(
        { _id: mongoosemerchantId },
        { $pull: { books: mongooseBookId } }
      );
      if (removedBookFromMerchantsBooksArray)
        res.status(200).json({ message: "book deleted successfully" });
    } else res.status(400).json({ message: "error deleting book" });
  } catch (error) {
    res.status(400).json({ message: "error deleting book" });
  }
});

module.exports = { addBook, getAllMerchantsBooks, getMerchantsBookById, deleteMerchantsBook };
