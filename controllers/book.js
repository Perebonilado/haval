const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");
const { BookModel } = require("../models/Book");
const { UserModel } = require("../models/User");
const mongoose = require("mongoose");

// upload book for sale
const uploadMerchantBook = ash(async (req, res) => {
  try {
    // validate request body, and continue if no errors
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      const { title, author, releaseDate, amount, genre, description } =
        req.body;
      const UserId = req.user;

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
                user: mongoose.Types.ObjectId(UserId),
              });
              const savedBook = await createdBook.save();
              if (savedBook) {
                try {
                  await UserModel.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId(UserId) },
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
    const UserId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const UsersBooks = await BookModel.find()
      .where("user")
      .equals(mongooseUserId);

    if (UsersBooks)
      res.status(200).json({ message: "Success", data: UsersBooks });
    else res.status(400).json({ message: "error getting books" });
  } catch (error) {
    res.status(400).json({ message: "error getting books" });
  }
});

const getMerchantsBookById = ash(async (req, res) => {
  try {
    const UserId = req.user;
    const { bookId } = req.params;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);
    const UsersBook = await BookModel.find({
      user: mongooseUserId,
      _id: mongooseBookId,
    }).populate("user");

    if (UsersBook)
      res.status(200).json({ message: "Success", data: UsersBook });
    else res.status(400).json({ message: "book does not exist" });
  } catch (error) {
    res.status(400).json({ message: "error getting book" });
  }
});

const deleteMerchantsBookById = ash(async (req, res) => {
  try {
    const UserId = req.user;
    const { bookId } = req.params;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);

    const deletedBook = await BookModel.findOneAndDelete({
      user: UserId,
      _id: bookId,
    });
    if (deletedBook) {
      const removedBookFromUsersBooksArray = await UserModel.findOneAndUpdate(
        { _id: mongooseUserId },
        { $pull: { books: mongooseBookId } }
      );
      if (removedBookFromUsersBooksArray)
        res.status(200).json({ message: "book deleted successfully" });
    } else res.status(400).json({ message: "error deleting book" });
  } catch (error) {
    res.status(400).json({ message: "error deleting book" });
  }
});

const getAllCustomersBooks = ash(async (req, res) => {
  try {
    const UserId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const user = await UserModel.findById(mongooseUserId).populate("books");
    if (user) {
      const usersBooks = user.books;
      res.status(200).json({ books: usersBooks });
    } else {
      res.status(400).json({ message: "Error finding user" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteCustomerBookById = ash(async (req, res) => {
  try {
    const UserId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const { bookId } = req.params;
    const mongooseBookId = mongoose.Types.ObjectId(bookId);
    const deletedBook = await UserModel.findOneAndUpdate(
      { _id: mongooseUserId },
      { $pull: { books: mongooseBookId } }
    );
    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(400).json({ message: "error deleting book" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const searchBookByTitle = ash(async (req, res) => {
  try {
    const { title } = req.query;
    const UserId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);

    const booksArr = await BookModel.find({
      title: { $regex: title, $options: "i" },
    });
    const User = await UserModel.findById(mongooseUserId)
    if (booksArr && User) {
      const usersBooks = User.books.map((item)=>item.title)
      const mutatedBooksArr = booksArr.map((item)=>{
        if(usersBooks.includes(item.title)){
          return {...item, isPurchased: true}
        }
        else return {...item, isPurchased: false}
      })
      res.status(200).json({ books: mutatedBooksArr[0]._doc });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  uploadMerchantBook,
  getAllMerchantsBooks,
  getMerchantsBookById,
  deleteMerchantsBookById,
  getAllCustomersBooks,
  deleteCustomerBookById,
  searchBookByTitle,
};
