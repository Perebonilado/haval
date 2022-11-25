const express = require("express")
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const { connectDB } = require("./config/db")
const app = express()
const PORT = process.env.PORT
const { catchErrors } = require("./middleware/error")
connectDB().catch((err)=>console.error(err))

const authRoutes = require("./routes/auth")
const bookRoutes = require("./routes/book")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/books", bookRoutes)










app.use(catchErrors)

app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`)
})
