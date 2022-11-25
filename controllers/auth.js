const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { UserModel } = require("../models/User");
const { WalletModel } = require("../models/Wallet");
const { validationResult } = require("express-validator");
const {
  encryptPassword,
  comparePassword,
} = require("../utils/lib/passwordEncryption");
const { generateJwtToken } = require("../utils/lib/generateToken");

const signUp = ash(async (req, res) => {
  try {
    // check if profile picture is in request
    let imageResult;
    if (req.file && req.file.path) {
      // upload file to cloudinary
      imageResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
    } else imageResult = "";
    // validate request body, and continue if no errors
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      const { firstName, lastName, email, username, password } = req.body;
      const encryptedPassword = await encryptPassword(password);
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
            const token = generateJwtToken(savedUser._id);
            res
              .status(200)
              .json({ message: "Account Creation Successful", token: token });
          }
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    } else {
      res.status(400).json(errors.array()[0].msg);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const login = ash(async (req, res) => {
  try {
    // validate request body contains correct data format
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      try {
        // find the user using email
        const user = await UserModel.findOne({ email: email });
        if (user) {
          // compare password passed to hashed password
          const passwordMatch = await comparePassword({
            plainPassword: password,
            hashedPassword: user.password,
          });
          if (passwordMatch) {
            /* if theres a match, generate a token using the users id and send it
             in the response */
            const token = generateJwtToken(user._id);
            res.status(200).json({ message: "login successful", token: token });
          } else res.status(400).json({ message: "Invalid password" });
        } else {
          res.status(400).json({ message: "Invalid email" });
        }
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else {
      res.status(400).json(errors.array()[0].msg);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { signUp, login };
