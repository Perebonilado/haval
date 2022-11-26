const ash = require("express-async-handler");
const { validationResult } = require("express-validator");
const { BookModel } = require("../models/Book");
const { UserModel } = require("../models/User");
const { SalesTokenModel } = require("../models/SalesToken")
const { TransactionModel } = require("../models/Transaction")
const mongoose = require("mongoose");

const generateBookSalesToken = ash(async(req, res)=>{
    /* 
    1. check if user has enough money in wallet to generate token
    2. if yes, 
    */
})


module.exports = { generateBookSalesToken }