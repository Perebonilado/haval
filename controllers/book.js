const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");
const { BookModel } = require("../models/Book");
const { UserModel } = require("../models/User");
const mongoose = require("mongoose");

const addBook = ash(async (req, res) => {
  try {
    // validate request body, and continue if no errors
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      const { title, author, releaseDate, amount, genre, description } =
        req.body;
      const userId = req.user;

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
                user: mongoose.Types.ObjectId(userId),
              });
              const savedBook = await createdBook.save();
              if (savedBook) {
                try {
                  await UserModel.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(userId) },
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

const getAllUserBooks = ash(async (req, res) => {
  try {
    const userId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const userBooks = await BookModel.find()
      .where("user")
      .equals(mongooseUserId);

    if (userBooks)
      res.status(200).json({ message: "Success", data: userBooks });
    else res.status(400).json({ message: "error getting books" });
  } catch (error) {
    res.status(400).json({ message: "error getting books" });
  }
});

const getUserBookById = ash(async (req, res) => {
  try {
    const userId = req.user;
    const { bookId } = req.params;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);
    const userBook = await BookModel.find({
      user: mongooseUserId,
      _id: mongooseBookId,
    }).populate("user");

    if (userBook) res.status(200).json({ message: "Success", data: userBook });
    else res.status(400).json({ message: "book does not exist" });
  } catch (error) {
    res.status(400).json({ message: "error getting book" });
  }
});

const deleteUserBook = ash(async (req, res) => {
  try {
    const userId = req.user;
    const { bookId } = req.params;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);

    const deletedBook = await BookModel.findOneAndDelete({
      user: userId,
      _id: bookId,
    });
    if (deletedBook) {
      const removedBookFromUserArray = await UserModel.findOneAndUpdate(
        { _id: mongooseUserId },
        { $pull: { books: mongooseBookId } }
      );
      if (removedBookFromUserArray)
        res.status(200).json({ message: "book deleted successfully" });
    } else
      res.status(400).json({ message: "error deleting book" });
  } catch (error) {
    res.status(400).json({ message: "error deleting book" });
  }
});



module.exports = { addBook, getAllUserBooks, getUserBookById, deleteUserBook };
