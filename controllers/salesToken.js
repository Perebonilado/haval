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
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const mongooseBookId = mongoose.Types.ObjectId(bookId);

    const User = await UserModel.findById(mongooseUserId);
    const book = await BookModel.findById(mongooseBookId);

    if (User && book) {
      if (book.user.equals(User._id)) {
        try {
          const UserWallet = await TokenWalletModel.findById(
            User.tokenWallet
          );
          if (UserWallet) {
            if (UserWallet.amount > havalChargeInNaira) {
              const salesTokenValue = generateUID();
              const newToken = new SalesTokenModel({
                amount: book.amount,
                book: book._id,
                user: User._id,
                token: salesTokenValue,
              });
              const savedToken = await newToken.save();
              if (savedToken) {
                try {
                  const transaction = new TransactionModel({
                    wallet_id: UserWallet._id,
                    type: transactionTypes.tokenOutflow,
                    description: `outflow for generating token worth ${savedToken.amount} for ${book.title}`,
                  });
                  const savedTransaction = transaction.save();
                  if (savedTransaction) {
                    try {
                      const updatedWallet = await UserWallet.updateOne({
                        $inc: { amount: -havalChargeInNaira },
                      });
                      const updatedBook = await book.updateOne({
                        $inc: { purchaseCount: 1 },
                      });
                      if (updatedWallet && updatedBook)
                        res.status(200).json({
                          message: "token successfully generated",
                          data: {
                            token: String(salesTokenValue),
                            bookTitle: book.title,
                            bookDescription: book.description,
                            author: book.author,
                            amount: book.amount,
                            bookCover: book.coverImageUrl,
                          },
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

const purchaseAssetWithToken = ash(async(req, res)=>{
  try {
    const { assetId, assetType, Token } = req.body
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})

module.exports = { generateBookSalesToken };
