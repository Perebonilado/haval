const { Schema, model } = require("mongoose");

const walletSchema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true},
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  amount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now(), immutable: true },
});

const WalletModel = model("Wallet", walletSchema);

module.exports = { WalletModel }
