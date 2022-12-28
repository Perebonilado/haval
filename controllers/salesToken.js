const ash = require("express-async-handler");
const { BookModel } = require("../models/Book");
const { UserModel } = require("../models/User");
const { SalesTokenModel } = require("../models/SalesToken");
const { TransactionModel } = require("../models/Transaction");
const { TokenWalletModel } = require("../models/TokenWallet");
const mongoose = require("mongoose");
const { generateUID } = require("../utils/lib/generateUID");
const { transactionTypes } = require("../utils/constants");
const { havalChargeInNaira } = require("../utils/constants");
const { validationResult } = require("express-validator");
const { generateMail, transporter } = require("../config/email");
const {
  tokenPurchaseNotification,
} = require("../templates/salesTokenPurchaseNotification");
const { validateEmail } = require("../utils/lib/validateEmail");
const { tokenSaleNotification } = require("../templates/tokenEmail");
const { allowedAssetTypes } = require("../utils/constants");

const generateBookSalesToken = ash(async (req, res) => {
  /* 
    1. find User and book
    2. check if User is the owner of the book
    3. find wallet
    4. check if User has enough money to generate token
    5. if 4 is true, charge User wallet and generate token
    5. store token in db 
    6. record transaction as outflow with description
    7. update wallet amount
    8. update purchase count on book
    */
  try {
    const UserId = req.user;
    const { bookId } = req.params;
    const count = req.query.count ? Number(req.query.count) : 1;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);

    const User = await UserModel.findById(mongooseUserId);
    const book = await BookModel.findById(mongooseBookId);

    if (User && book) {
      if (book.user.equals(User._id)) {
        try {
          const UserWallet = await TokenWalletModel.findById(User.tokenWallet);
          if (UserWallet) {
            if (UserWallet.amount > count * havalChargeInNaira) {
              const tokensArr = [];
              for (let i = 0; i < count; i++) {
                const salesTokenValue = generateUID();
                const newToken = new SalesTokenModel({
                  amount: book.amount,
                  book: book._id,
                  user: User._id,
                  token: salesTokenValue,
                });
                const savedToken = await newToken.save();
                tokensArr.push({
                  token: savedToken.token,
                  bookTitle: book.title,
                  bookDescription: book.description,
                  author: book.author,
                  bookCover: book.coverImageUrl,
                });
              }
              if (tokensArr.length) {
                try {
                  const transaction = new TransactionModel({
                    wallet_id: UserWallet._id,
                    type: transactionTypes.tokenOutflow,
                    description: `outflow for generating ${count} token(s) worth ${book.amount} each for ${book.title}.`,
                  });
                  const savedTransaction = transaction.save();
                  if (savedTransaction) {
                    try {
                      const updatedWallet = await UserWallet.updateOne({
                        $inc: { amount: -(count * havalChargeInNaira) },
                      });
                      const updatedBook = await book.updateOne({
                        $inc: { purchaseCount: count },
                      });
                      if (updatedWallet && updatedBook)
                        res.status(200).json({
                          message: "token(s) successfully generated",
                          data: tokensArr,
                        });
                    } catch (error) {
                      res.status(400).json({ message: error.message });
                    }
                  }
                } catch (error) {
                  res.status(400).json({ message: error.message });
                }
              } else res.status(400).json({ message: "Error saving token" });
            } else
              res.status(400).json({
                message: "Insuffecient amount in wallet to generate token",
              });
          } else res.status(400).json({ message: "error verifying wallet" });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      } else
        res.status(400).json({
          message: "unable to generate token for a different Users's book",
        });
    } else res.status(400).json({ message: "error finding resource" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const purchaseAssetWithToken = ash(async (req, res) => {
  /* 
  1. check if token is exists
  2. check if token matches the asset being purchased and amount matches
  3. add book to users library
  4. delete token from sales token
  */
  try {
    const errors = validationResult(req);
    const UserId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    if (errors.isEmpty()) {
      const { asset_id, asset_type, token } = req.body;
      const validToken = await SalesTokenModel.findOne({ token: token });
      if (validToken) {
        const mongooseAssetId = mongoose.Types.ObjectId(asset_id);
        if (asset_type === "book") {
          const book = await BookModel.findById(mongooseAssetId);
          const user = await UserModel.findById(mongooseUserId);
          if (!book) res.status(400).json({ message: "Book does not exist" });
          if (!user) res.status(400).json({ message: "Error finding user" });
          if (user && book) {
            if (validToken.book.equals(book._id)) {
              const updatedUser = await user.updateOne({
                $push: { books: book._id },
              });
              if (updatedUser) {
                await SalesTokenModel.findByIdAndDelete(validToken._id);

                res.status(200).json({
                  message: `${book.title} succesfully added to library`,
                });
              } else
                res.status(400).json({
                  message: "Error adding book to library, please retry",
                });
            } else
              res
                .status(400)
                .json({ message: "This token cannot purchase this asset" });
          }
        }
      } else res.status(400).json({ message: "token is no longer valid" });
    } else res.status(400).json(errors.array()[0].msg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const sendTokenViaEmail = ash(async (req, res) => {
  try {
    const errors = validationResult(req);
    const user = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(user);
    if (errors.isEmpty()) {
      const { email, token, assetName, assetImage } = req.body;
      const storedToken = await SalesTokenModel.findOne({
        token: token,
        user: mongooseUserId,
      });
      if (storedToken) {
        await storedToken.updateOne({ $set: { sentTo: email } });
        const mail = generateMail({
          to: email,
          subject: `Token Purchase for ${assetName}`,
          html: tokenSaleNotification({
            assetName: assetName,
            token: token,
            assetImage: assetImage,
          }),
        });
        await transporter.sendMail(mail);
        res.status(200).json({ message: "Token successfully sent" });
      }
    } else res.status(400).json({ message: errors.array()[0].msg.message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getUnusedTokens = ash(async (req, res) => {
  try {
    const userId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { asset_type, asset_id } = req.query;
      const mongooseAssetId = mongoose.Types.ObjectId(asset_id);
      if (allowedAssetTypes.includes(asset_type)) {
        if (asset_type === "book") {
          const unusedTokens = await SalesTokenModel.find({
            user: mongooseUserId,
            book: mongooseAssetId,
          }).populate("book", "coverImageUrl title");
          res.status(200).json({ message: "successful", data: unusedTokens });
        }
      } else res.status(400).json({ message: "invalid asset type" });
    } else res.status(400).json({ message: errors.array()[0].msg.message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  generateBookSalesToken,
  purchaseAssetWithToken,
  sendTokenViaEmail,
  getUnusedTokens,
};
