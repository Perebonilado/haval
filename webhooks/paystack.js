const ash = require("express-async-handler");
const crypto = require("crypto");
const secret = process.env.PAYSTACK_SECRET;
const { UserModel } = require("../models/User");
const { TokenWalletModel } = require("../models/TokenWallet");
const { transactionTypes } = require("../utils/constants");
const { TransactionModel } = require("../models/Transaction");
const { havalChargeInNaira } = require("../utils/constants");
const { convertKoboToNaira } = require("../utils/lib/currencyConversion");
const { BookModel } = require("../models/Book");
const { RevenueWalletModel } = require("../models/RevenueWallet");
const mongoose = require("mongoose");

const confirmPaymentWebHook = ash(async (req, res) => {
  //validate event
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = req.body;
    if (event.event === "charge.success") {
      /*
        0. send back response first
        */
      res.status(200);
      // check the initiator
      if (event.data.metadata.initiator === "merchant") {
        /*
       if initiator is a User then fund the Users token wallet
       STEPS
        1. find User
        2. find wallet
        3. credit wallet
        4. record transaction as inflow
        */
        try {
          const User = await UserModel.findOne({
            email: event.data.customer.email,
          });
          if (User) {
            const amountInKobo = event.data.amount;
            const amountInNaira = convertKoboToNaira(amountInKobo);

            const transaction = new TransactionModel({
              wallet_id: User.tokenWallet,
              type: transactionTypes.tokenInflow,
              description: `NGN${amountInNaira} for wallet funding`,
            });
            const savedTransaction = await transaction.save();
            if (savedTransaction) {
              await TokenWalletModel.findOneAndUpdate(
                { user: User._id },
                {
                  $inc: { amount: amountInNaira },
                  $push: { transactions: savedTransaction._id },
                }
              );

              // send email
              res.end();
            }
          }
        } catch (error) {
          res.status(200);
        }
      } else if (event.data.metadata.initiator === "customer") {
        try {
          const User = await UserModel.findOne({
            email: event.data.customer.email,
          });
          if (User) {
            /* 
            1. check for the asset type and find the asset using the asset id accordingly
            2. update the user with that asset
            3. update the merchants revenue wallet 
            4. update book purchase count
            5. record the transaction accordingly
            */
            const assetType = event.data.metadata.asset_type;
            const assetId = event.data.metadata.asset_id;
            const mongooseAssetId = mongoose.Types.ObjectId(assetId);

            // book purchase
            if (assetType === "book") {
              const book = await BookModel.findById(mongooseAssetId);
              if (book) {
                const updatedUser = await User.updateOne({
                  $push: { books: book._id },
                });
                const merchantRevenueWallet = await RevenueWalletModel.findOne({
                  user: book.user,
                });
                const updatedBook = await book.updateOne({
                  $inc: { purchaseCount: 1 },
                });

                if (merchantRevenueWallet && updatedUser && updatedBook) {
                  const amountInKobo = event.data.amount;
                  const amountInNaira = convertKoboToNaira(amountInKobo);
                  const merchantGrossProfit =
                    amountInNaira - havalChargeInNaira;

                  const updatedMerchantRevenueWallet =
                    await merchantRevenueWallet.updateOne({
                      $inc: { amount: merchantGrossProfit },
                    });
                  if (updatedMerchantRevenueWallet) {
                    const transaction = new TransactionModel({
                      wallet_id: merchantRevenueWallet._id,
                      type: transactionTypes.salesInflow,
                      description: `NGN${amountInNaira} for book sales - ${book.title}`,
                    });

                    const savedTransaction = await transaction.save();
                    if (savedTransaction) {
                      // send email
                      res.end();
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          res.status(200);
        }
      }
    } else if (event.event === "transfer.success") {
      // logic to deduct money from merchants revenue wallet
      res.status(200).end();
    } else if (
      event.event === "transfer.failed" ||
      event.event === "transfer.reversed"
    ) {
      // reverse the money back into users revenue wallet and record transaction
      const { email } = event.data.recipient
      const { amount } = event.data

      const user = await UserModel.findOne({ email: email})
      const revenueWallet = await RevenueWalletModel.findOneAndUpdate({_id: user.revenueWallet}, { $inc: { amount: amount}})
      const transaction = new TransactionModel({
        wallet_id: user.revenueWallet,
        type: transactionTypes.reversal,
        description: `Reversal for failed transaction worth ${amount}`
      })
      await transaction.save()
      res.status(200).end()

    }
  } else {
    res.status(200).end();
    // send notification mail on failed transaction...
  }
});

module.exports = { confirmPaymentWebHook };
