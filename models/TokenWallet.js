const { Schema, model } = require("mongoose");

const tokenWalletSchema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  amount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now(), immutable: true },
});

const TokenWalletModel = model("TokenWallet", tokenWalletSchema);

module.exports = { TokenWalletModel }
