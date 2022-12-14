exports.URI = process.env.MONGO_URI
exports.PRIVATE_KEY=process.env.JWT_PRIVATE_KEY
exports.transactionTypes = {
    tokenInflow: "token_inflow",
    tokenOutflow: "token_outflow",
    salesInflow: "sales_inflow",
    withdrawalOutflow: "withdrawal_outflow",
    reversal: "reversal"
}
exports.PAYSTACK_SECRET = process.env.PAYSTACK_SECRET
exports.havalChargeInNaira=150
exports.allowedAssetTypes = [ "book", "audio", "video"]