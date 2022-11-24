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
    required: true,
  },
  books: {
    type: [{ type: Schema.Types.ObjectId, ref: "Books" }],
  },
  wallet: {
    type: { type: Schema.Types.ObjectId, ref: "Wallet" },
  },
  updated_at: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now(), immutable: true },
});

exports.UserModel = model("User", UserSchema);
