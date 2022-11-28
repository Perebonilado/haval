const ash = require("express-async-handler");
const axios = require("axios");
const { PAYSTACK_SECRET } = require("../utils/constants");
const { validationResult } = require("express-validator");
const https = require("https");
const { UserModel } = require("../models/User");
const mongoose = require("mongoose");
const { convertNairaToKobo } = require("../utils/lib/currencyConversion")

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
    const userId = reqObj.user;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(mongooseUserId);
    if (user) {
      const params = JSON.stringify({
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
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
    } else resObj.status(400).json({ message: "Error fetching user" });
  } catch (error) {
    resObj.status(400).json({ message: error.message });
  }
});

const fetchCustomer = ash(async (req, res) => {
  try {
    const userId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(mongooseUserId);
    if (user) {
      const customerDetails = await axios({
        port: 443,
        url: `http://api.paystack.co/customer/${user.email}`,
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
    } else res.status(400).json({ message: "Error fetching user" });
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
    const userId = reqObj.user;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(mongooseUserId);
    if (user) {
      const errors = validationResult(reqObj);
      if (!errors.isEmpty()) resObj.status(400).json(errors.array()[0].msg);
      else {
        const { amount } = reqObj.body;
        const amountInKobo = convertNairaToKobo(amount)
        
        const params = JSON.stringify({
          email: user.email,
          amount: String(amountInKobo),
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
    } else resObj.status(400).json({ message: "unable to find user" });
  } catch (error) {
    console.log(error)
    resObj.status(400).json({message: error.message})
  }
});

module.exports = {
  getBanksList,
  verifyBankAccountNumber,
  createCustomer,
  fetchCustomer,
  createDedicatedVirtualAccount,
  initalizeTransaction,
};