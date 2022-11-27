const ash = require("express-async-handler")
const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET;


const confirmPaymentWebHook = ash(async(req, res)=>{
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    console.log(event)  
    }
    res.send(200);
})


module.exports = { confirmPaymentWebHook }