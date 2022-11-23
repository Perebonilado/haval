
const catchErrors = (err, req, res, next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode).json({message: err.message})
}

module.exports = { catchErrors }