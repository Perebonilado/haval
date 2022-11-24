const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { UserModel } = require("../models/User");
const { WalletModel } = require("../models/Wallet");
const { validationResult } = require("express-validator");
const { encryptPassword } = require("../utils/lib/passwordEncryption")
const { generateToken } = require("../utils/lib/generateToken")

const signUp = ash(async (req, res) => {
  try {
    // check if profile picture is uploaded
    let imageResult;
    if (req.file && req.file.path) {
      imageResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
    } else imageResult = "";
    // validate request body
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      const { firstName, lastName, email, username, password } = req.body;
      const encryptedPassword = await encryptPassword(password)
      const user = new UserModel({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: encryptedPassword,
        email: email,
        profilePictureURL: imageResult ? imageResult.secure_url : "",
      });

      // save the user
      const savedUser = await user.save();

      // create a wallet after saving user
      if (savedUser) {
        try {
          const userWallet = new WalletModel({
            user: savedUser._id,
          });

          // save the wallet
          const savedWallet = await userWallet.save();

          // update the user with the wallet ID
          if (savedWallet) {
            await UserModel.updateOne(
              { _id: savedUser._id },
              {
                wallet: savedWallet._id,
              }
            );
            // generate jwt using users Id, send response
            const token = generateToken(savedUser._id)
            res.status(200).json({ message: "Account Creation Successful", token: token });
          }
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const login = ash(async (req, res) => {
  res.status(200).json({ message: "you are logged in" });
});

module.exports = { signUp, login };
