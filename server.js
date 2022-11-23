const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const PORT = process.env.PORT

const authRoutes = require("./routes/auth")


app.use("/api/v1/auth", authRoutes)












app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`)
})
