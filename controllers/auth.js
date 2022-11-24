const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { UserModel } = require("../models/User");
const { validationResult } = require("express-validator");

const signUp = ash(async (req, res) => {
  try {
    let imageResult
    if (req.file && req.file.path) {
      imageResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
    }
    else imageResult = ""
    // validate request body
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      const { firstName, lastName, email, username, password } = req.body;
      const user = new UserModel({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        profilePictureURL: imageResult ? imageResult.secure_url : "",
      });

      await user.save();
      res.status(200).json({ message: user });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const login = ash(async (req, res) => {
  res.status(200).json({ message: "you are logged in" });
});

module.exports = { signUp, login };
