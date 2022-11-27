const ash = require("express-async-handler");
const crypto = require("crypto");
const secret = process.env.PAYSTACK_SECRET;
const { UserModel } = require("../models/User");
const { WalletModel } = require("../models/Wallet");
const { transactionTypes } = require("../utils/constants");
const { TransactionModel } = require("../models/Transaction");

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
        1. find user
        2. find wallet
        3. credit wallet
        4. record transaction as inflow
        */
      res.status(200);
      const user = await UserModel.findOne({
        email: event.data.customer.email,
      });
      if (user) {
        const wallet = WalletModel.findById(user.wallet);
        if (wallet) {
          const koboToNaira = 100;
          const amountInKobo = event.data.amount;
          const amountInNaira = amountInKobo / koboToNaira;

          const updatedWallet = await wallet.updateOne({
            $inc: { amount: amountInNaira },
          });
          if (updatedWallet) {
            const transaction = new TransactionModel({
              wallet_id: userWallet._id,
              type: transactionTypes.outflow,
              description: `${transactionTypes.outflow} for generating token worth ${savedToken.amount} for ${book.title}`,
            });
            await transaction.save();
          }
        }
      }
    }
  }
  else res.send(200);
});

module.exports = { confirmPaymentWebHook };
