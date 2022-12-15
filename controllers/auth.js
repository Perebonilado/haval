const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { UserModel } = require("../models/User");
const { TokenWalletModel } = require("../models/TokenWallet");
const { validationResult } = require("express-validator");
const {
  encryptPassword,
  comparePassword,
} = require("../utils/lib/passwordEncryption");
const { generateJwtToken } = require("../utils/lib/generateToken");
const { generateMail, transporter } = require("../config/email");
const { loginNotification } = require("../templates/loginNotification");
const { signupNotification } = require("../templates/signupNotification");

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
      const { firstName, lastName, email, username, password, isMerchant } = req.body;
      const encryptedPassword = await encryptPassword(password);
      const User = new UserModel({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: encryptedPassword,
        email: email,
        isMerchant: isMerchant==="true" ? true : false,
        profilePictureURL: imageResult ? imageResult.secure_url : "",
      });

      // save the User
      const savedUser = await User.save();

      // create a wallet after saving User
      if (savedUser) {
        try {
          const UserWallet = new TokenWalletModel({
            user: savedUser._id,
          });

          // save the wallet
          const savedUserWallet = await UserWallet.save();

          // update the User with the wallet ID
          if (savedUserWallet) {
            await UserModel.updateOne(
              { _id: User._id },
              {
                wallet: savedUserWallet._id,
              }
            );
            //
            // generate jwt using Users Id, send response
            const token = generateJwtToken(User._id);
            const mail = generateMail({
              to: User.email,
              subject: "Haval Account Successfully Created",
              html: signupNotification({
                name: `${User.firstName} ${User.lastName}`,
              }),
            });
            await transporter.sendMail(mail);
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
        // find the User using email
        const User = await UserModel.findOne({ email: email });
        if (User) {
          // compare password passed to hashed password
          const passwordMatch = await comparePassword({
            plainPassword: password,
            hashedPassword: User.password,
          });
          if (passwordMatch) {
            /* if theres a match, generate a token using the Users id and send it
             in the response */
            const token = generateJwtToken(User._id);
            const mail = generateMail({
              to: User.email,
              subject: "Login to haval account",
              html: loginNotification({
                name: `${User.firstName} ${User.lastName}`,
              }),
            });
            await transporter.sendMail(mail);
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
