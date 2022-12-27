const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema({
  type: {
    type: String,
    enum: ["token_inflow", "token_outflow", "sales_inflow", "withdrawal_outflow"],
    required: [true, "please provide transaction type"],
  },
  wallet_id: {
    type: Schema.Types.ObjectId,
    ref: "TokenWallet",
    required: [true, "Please, provide wallet Id"]
  },
  description: {
    type: String,
    required: [true, "please provide description"]
  },
  initiation_date: {
    type: Date,
    default: Date.now(),
    immutable: true
  },
});

const TransactionModel = model("Transaction", TransactionSchema);

module.exports = { TransactionModel };
