const { Schema, model } = require("mongoose");

const MerchantSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "firstname is a required field"],
  },
  lastName: {
    type: String,
    required: [true, "lastname is a required field"],
  },
  email: {
    type: String,
    required: [true, "email is a required field"],
    unique: true,
    dropDups: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: [true, "username is a required field"],
    unique: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: [true, "password is a required field"],
  },
  profilePictureURL: {
    type: String,
  },
  books: {
    type: [{ type: Schema.Types.ObjectId, ref: "Books" }],
  },
  wallet: {
    type: Schema.Types.ObjectId, 
    ref: "Wallet",
    default: null
  },
  updated_at: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now(), immutable: true },
});

exports.MerchantModel = model("Merchant", MerchantSchema);
