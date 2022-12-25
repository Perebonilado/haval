const ash = require("express-async-handler");
const { UserModel } = require("../models/User");
const mongoose = require("mongoose");

const getUserInformation = ash(async (req, res) => {
  try {
    const userId = req.user;
    const mongooseUserId = mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(mongooseUserId)
      .populate("tokenWallet revenueWallet")
      // .select(["firstName", "lastName", "username", "profilePictureURL", "tokenWallet", "revenueWallet"]);

    if (user) {
      res.status(200).json({ message: "successful", data: user });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { getUserInformation };
