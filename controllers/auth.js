const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { MerchantModel } = require("../models/Merchant");
const { TokenWalletModel } = require("../models/TokenWallet");
const { validationResult } = require("express-validator");
const {
  encryptPassword,
  comparePassword,
} = require("../utils/lib/passwordEncryption");
const { generateJwtToken } = require("../utils/lib/generateToken");
const { generateMail, transporter } = require("../config/email");
const { loginNotification } = require("../templates/loginNotification");
const { signupNotification } = require("../templates/signupNotification")

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
      const merchant = new MerchantModel({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: encryptedPassword,
        email: email,
        profilePictureURL: imageResult ? imageResult.secure_url : "",
      });

      // save the merchant
      const savedMerchant = await merchant.save();

      // create a wallet after saving merchant
      if (savedMerchant) {
        try {
          const merchantWallet = new TokenWalletModel({
            user: savedMerchant._id,
          });

          // save the wallet
          const savedMerchantWallet = await merchantWallet.save();

          // update the merchant with the wallet ID
          if (savedMerchantWallet) {
            await MerchantModel.updateOne(
              { _id: merchant._id },
              {
                wallet: savedMerchantWallet._id,
              }
            );
            // 
            // generate jwt using merchants Id, send response
            const token = generateJwtToken(merchant._id);
            const mail = generateMail({
              to: merchant.email,
              subject: "Haval Account Successfully Created",
              html: signupNotification({
                name: `${merchant.firstName} ${merchant.lastName}`,
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
        // find the merchant using email
        const merchant = await MerchantModel.findOne({ email: email });
        if (merchant) {
          // compare password passed to hashed password
          const passwordMatch = await comparePassword({
            plainPassword: password,
            hashedPassword: merchant.password,
          });
          if (passwordMatch) {
            /* if theres a match, generate a token using the merchants id and send it
             in the response */
            const token = generateJwtToken(merchant._id);
            const mail = generateMail({
              to: merchant.email,
              subject: "Login to haval account",
              html: loginNotification({
                name: `${merchant.firstName} ${merchant.lastName}`,
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
