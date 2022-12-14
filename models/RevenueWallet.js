const { Schema, model } = require("mongoose");

const RevenueWalletSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  amount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now(), immutable: true },
});

exports.RevenueWalletModel = model("RevenueWallet", RevenueWalletSchema)