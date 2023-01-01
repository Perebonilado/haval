const ash = require("express-async-handler");
const axios = require("axios");
const { PAYSTACK_SECRET } = require("../utils/constants");
const { validationResult } = require("express-validator");
const https = require("https");
const { UserModel } = require("../models/User");
const { RevenueWalletModel } = require("../models/RevenueWallet");
const { TransactionModel } = require("../models/Transaction");
const mongoose = require("mongoose");
const { convertNairaToKobo } = require("../utils/lib/currencyConversion");
const { v4: uuidv4 } = require("uuid");

const getBanksList = ash(async (req, res) => {
  try {
    const { pay_with_bank } = req.query;
    const url = !pay_with_bank
      ? "http://api.paystack.co/bank?currency=NGN"
      : "http://api.paystack.co/bank?currency=NGN&pay_with_bank=true";
    const banksList = await axios({
      port: 443,
      url: url,
      method: "GET",
      headers: {
        Authorization: `Bearer SECRET_KEY ${PAYSTACK_SECRET}`,
      },
    });
    if (banksList)
      res.status(200).json({ message: "success", data: banksList.data.data });
    else res.status(400).json({ message: "error fetching banks list" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const verifyBankAccountNumber = ash(async (req, res) => {
  try {
    const { account_number, bank_code } = req.query;
    const bankAccountData = await axios({
      port: 443,
      url: `http://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "content-type": "*",
        "cache-control": "no-cache",
      },
    });
    if (bankAccountData)
      res
        .status(200)
        .json({ message: "success", data: bankAccountData.data.data });
    else res.status(400).json({ message: "Error verifying bank account" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

const createCustomer = ash(async (reqObj, resObj) => {
  try {
    const UserId = reqObj.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const User = await UserModel.findById(mongooseUserId);
    if (User) {
      const params = JSON.stringify({
        email: User.email,
        first_name: User.firstName,
        last_name: User.lastName,
      });

      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/customer",
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      };

      const req = https
        .request(options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resObj
              .status(200)
              .json({ message: "successful", data: JSON.parse(data) });
          });
        })
        .on("error", (error) => {
          resObj.status(400).json({ message: error.message });
        });

      req.write(params);
      req.end();
    } else resObj.status(400).json({ message: "Error fetching User" });
  } catch (error) {
    resObj.status(400).json({ message: error.message });
  }
});

const fetchCustomer = ash(async (req, res) => {
  try {
    const UserId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const User = await UserModel.findById(mongooseUserId);
    if (User) {
      const customerDetails = await axios({
        port: 443,
        url: `http://api.paystack.co/customer/${User.email}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "content-type": "*",
          "cache-control": "no-cache",
        },
      });

      if (customerDetails) {
        res
          .status(200)
          .json({ message: "success", data: customerDetails.data.data });
      } else
        res.status(400).json({ message: "error fetching customer details" });
    } else res.status(400).json({ message: "Error fetching User" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const createDedicatedVirtualAccount = ash(async (reqObj, resObj) => {
  try {
    const errors = validationResult(reqObj);
    if (!errors.isEmpty()) resObj.status(400).json(errors.array()[0].msg);
    else {
      const { customerId } = reqObj.body;
      const params = JSON.stringify({
        customer: Number(customerId),
        preferred_bank: "test-bank",
      });

      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/dedicated_account",
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      };

      const req = https
        .request(options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resObj.status(res.statusCode).json({ data: JSON.parse(data) });
          });
        })
        .on("error", (error) => {
          resObj.status(400).json({ message: error.message });
        });

      req.write(params);
      req.end();
    }
  } catch (error) {
    resObj.status(400).json({ message: error.message });
  }
});

const initalizeTransaction = ash(async (reqObj, resObj) => {
  try {
    const UserId = reqObj.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const User = await UserModel.findById(mongooseUserId);
    if (User) {
      const errors = validationResult(reqObj);
      if (!errors.isEmpty()) resObj.status(400).json(errors.array()[0].msg);
      else {
        const { amount, initiator, asset_id, asset_type, success_url } =
          reqObj.body;
        const amountInKobo = convertNairaToKobo(amount);
        // initiator: merchant | customer
        // asset_type: book
        // asset_id: bookId
        const metadata = {
          initiator: initiator,
          asset_type: asset_type || "",
          asset_id: asset_id || "",
        };

        const params = JSON.stringify({
          email: User.email,
          amount: String(amountInKobo),
          metadata: JSON.stringify(metadata),
          callback_url: success_url || undefined,
        });

        const options = {
          hostname: "api.paystack.co",
          port: 443,
          path: "/transaction/initialize",
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
          },
        };

        const req = https
          .request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
              data += chunk;
            });

            res.on("end", () => {
              resObj.status(res.statusCode).json({ data: JSON.parse(data) });
            });
          })
          .on("error", (error) => {
            resObj.status(400).json({ message: error.message });
          });

        req.write(params);
        req.end();
      }
    } else resObj.status(400).json({ message: "unable to find User" });
  } catch (error) {
    resObj.status(400).json({ message: error.message });
  }
});

const createTransferRecipient = ash(async (reqObj, resObj) => {
  try {
    const errors = validationResult(reqObj);
    if (!errors.isEmpty())
      resObj.status(400).json({ message: errors.array()[0].msg.message });
    else {
      const { name, account_number, bank_code } = reqObj.body;

      const params = JSON.stringify({
        type: "nuban",
        name: name,
        account_number: account_number,
        bank_code: bank_code,
        currency: "NGN",
      });

      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transferrecipient",
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      };

      const req = https
        .request(options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resObj
              .status(res.statusCode)
              .json({ message: "successful", data: JSON.parse(data) });
          });
        })
        .on("error", (error) => {
          resObj.status(400).json({ message: error.message });
        });

      req.write(params);
      req.end();
    }
  } catch (error) {
    resObj.status(400).json({ message: error.message });
  }
});

const initiateTransfer = ash(async (reqObj, resObj) => {
  try {
    const errors = validationResult(reqObj);
    const UserId = reqObj.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);

    if (!errors.isEmpty())
      resObj.status(400).json({ message: errors.array()[0].msg.message });
    else {
      const { amount, recipient, reason } = reqObj.body;
      const uniqueRef = uuidv4();
      const revenueWallet = await RevenueWalletModel.findOne({
        user: mongooseUserId,
      });
      if (revenueWallet.amount >= amount) {
        const metaData = {
          initiator: "merchant",
          wallet_id: revenueWallet._id,
        };

        const params = JSON.stringify({
          source: "balance",
          amount: amount,
          reference: uniqueRef,
          recipient: recipient,
          reason: reason,
        });

        const options = {
          hostname: "api.paystack.co",
          port: 443,
          path: "/transfer",
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
          },
          metadata: JSON.stringify(metaData),
        };

        const req = https
          .request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
              data += chunk;
            });

            res.on("end", () => {
              resObj.status(200).json({ data: JSON.parse(data) });
            });
          })
          .on("error", (error) => {
            resObj.status(400).json({ message: error.message });
          });

        req.write(params);
        req.end();
      } else
        resObj
          .status(400)
          .json({ message: "Insuffienct funds in revenue wallet" });
    }
  } catch (error) {
    resObj.status(400).json({ message: error.message });
  }
});

const finalizeTransfer = ash(async (reqObj, resObj) => {
  try {
    const UserId = reqObj.user;
    const mongooseUserId = mongoose.Types.ObjectId(UserId);
    const errors = validationResult(reqObj);
    if (!errors.isEmpty())
      resObj.status(400).json({ message: errors.array()[0].msg.message });
    else {
      const { transfer_code, otp, amount } = reqObj.body;
      await RevenueWalletModel.findOneAndUpdate(
        { user: mongooseUserId },
        { $inc: { amount: -amount } });

      const params = JSON.stringify({
        transfer_code: transfer_code,
        otp: otp,
      });

      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transfer/finalize_transfer",
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      };

      const req = https
        .request(options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resObj.status(200).json({ data: JSON.parse(data) });
          });
        })
        .on("error", (error) => {
          resObj.status(400).json({ data: error.message });
        });

      req.write(params);
      req.end();
    }
  } catch (error) {
    resObj.status(400).json({ message: error.message });
  }
});

module.exports = {
  getBanksList,
  verifyBankAccountNumber,
  createCustomer,
  fetchCustomer,
  createDedicatedVirtualAccount,
  initalizeTransaction,
  createTransferRecipient,
  initiateTransfer,
  finalizeTransfer,
};
