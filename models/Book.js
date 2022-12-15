const { Schema, model } = require("mongoose");

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, "please provide book title"],
  },
  author: {
    type: String,
    required: [true, "please provide author name"],
  },
  bookUrl: {
    type: String,
    required: [true, "please provide book url"],
  },
  coverImageUrl: {
    type: String,
    required: [true, "please provide cover image"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "please provide linked user id"],
  },
  releaseDate: {
    type: Date,
    required: [true, "please provide valid release date"],
    message: (input) =>
      `${input} must be greater than or equal to the current date!`,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 2.5,
  },
  purchaseCount: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    min: 300,
    max: 1500,
    required: [true, "Please, provide the cost of this book."],
  },
  genre: {
    type: String,
    required: true,
    enum: [
      "religion",
      "drama",
      "fiction",
      "non-fiction",
      "health",
      "comedy",
      "romance",
    ],
  },
  description: {
    type: String,
    required: true,
  }, 
});

const BookModel = model("Book", BookSchema);

module.exports = { BookModel }
