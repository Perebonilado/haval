const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema({
  type: {
    type: String,
    enum: ["inflow", "outflow"],
    required: [true, "please provide transaction type"],
  },
  wallet_id: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
    required: [true, "Please, provide wallet Id"]
  },
  initiation_date: {
    type: Date,
    default: Date.now(),
  },
});

const TransactionModel = model("Transaction", TransactionSchema);

module.exports = { TransactionModel };
