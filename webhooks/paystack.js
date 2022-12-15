const ash = require("express-async-handler");
const crypto = require("crypto");
const secret = process.env.PAYSTACK_SECRET;
const { UserModel } = require("../models/User");
const { TokenWalletModel } = require("../models/TokenWallet");
const { transactionTypes } = require("../utils/constants");
const { TransactionModel } = require("../models/Transaction");
const { havalChargeInNaira } = require("../utils/constants");
const { convertKoboToNaira } = require("../utils/lib/currencyConversion");

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
            const wallet = TokenWalletModel.findById(User.wallet);
            if (wallet) {
              const amountInKobo = event.data.amount;
              const amountInNaira = convertKoboToNaira(amountInKobo);

              const updatedWallet = await wallet.updateOne({
                $inc: { amount: amountInNaira },
              });
              const transaction = new TransactionModel({
                wallet_id: User.wallet,
                type: transactionTypes.tokenInflow,
                description: `NGN${amountInNaira} for wallet funding`,
              });
              const savedTransaction = await transaction.save();
              if (updatedWallet && savedTransaction) {
                // send email
                res.end();
              }
            }
          }
        } catch (error) {
          res.status(200);
        }
      }
    }
  } else {
    res.send(200);
    // send notification mail on failed transaction...
  }
});

module.exports = { confirmPaymentWebHook };
