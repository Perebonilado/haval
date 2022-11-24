const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { UserModel } = require("../models/User");

const signUp = ash(async (req, res) => {
  try {
    const imageResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });
    const user = new UserModel({
      firstName: req.body.firstName,
      profilePictureURL: imageResult.secure_url,
    });

    await user.save();
    res.status(200).json({ message: user });
  } catch (error) {
    res.send(error.message);
  }
});

const login = ash(async (req, res) => {
  res.status(200).json({ message: "you are logged in" });
});

module.exports = { signUp, login };
