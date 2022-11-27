exports.URI = process.env.MONGO_URI
exports.PRIVATE_KEY=process.env.JWT_PRIVATE_KEY
exports.transactionTypes = {
    inflow: "inflow",
    outflow: "outflow"
}
exports.PAYSTACK_SECRET = process.env.PAYSTACK_SECRET