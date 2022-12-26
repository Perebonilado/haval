const ash = require("express-async-handler");
const { RevenueWalletModel } = require("../models/RevenueWallet");
const { TokenWalletModel } = require("../models/TokenWallet");
const mongoose = require("mongoose")

const getWallets = ash(async (req, res) => {
  try {
    const userId = req.user
    const mongooseUserId = mongoose.Types.ObjectId(userId)
    const revenueWallet = await RevenueWalletModel.findOne({user: mongooseUserId}).populate("transactions")
    const tokenWallet = await TokenWalletModel.findOne({user: mongooseUserId}).populate("transactions")
    res.status(200).json({revenueWallet, tokenWallet})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { getWallets }
