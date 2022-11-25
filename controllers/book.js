const ash = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");


const addBook = ash((req, res)=>{
        try {
            // validate request body, and continue if no errors
            const errors = validationResult(req);
            if (errors.isEmpty()) {
               res.status(200).json({message: errors.array()})
            }
            else res.status(400).json(errors.array()[0].msg)
        } catch (error) {
            res.status(400).json({message: error.message})
        }
     }
)


module.exports = { addBook }