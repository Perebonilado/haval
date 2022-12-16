const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
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
  role: {
    type: String,
    enum: [ "admin_user", "regular_user" ],
    default: "regular_user"
  },
  isMerchant: {
    type: Boolean,
    default: false
  },
  isCustomer: {
    type: Boolean,
    default: true
  },
  profilePictureURL: {
    type: String,
  },
  books: {
    type: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  tokenWallet: {
    type: Schema.Types.ObjectId, 
    ref: "TokenWallet",
    default: null
  },
  revenueWallet: {
    type: Schema.Types.ObjectId, 
    ref: "RevenueWallet",
    default: null
  },
  updated_at: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now(), immutable: true },
});

exports.UserModel = model("User", UserSchema);
