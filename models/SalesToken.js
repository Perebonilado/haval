const { Schema, model } = require("mongoose");

const SalesTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Merchant",
    required: [true, "Provide a valid user generating token"],
  },
  amount: {
    type: Number,
    required: [true, "Provide a anount within range of 300 to 1500"],
    min: 300,
    max: 1500,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Provide id of book this token grants access to "],
  },
  token: {
    type: String,
    required: [true, "Provide token"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
});

const SalesTokenModel = model("SalesToken", SalesTokenSchema);

module.exports = { SalesTokenModel };
