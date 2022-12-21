const express = require("express")
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const compression = require("compression");
const cors = require("cors")
const helmet = require("helmet");
dotenv.config()
const { connectDB } = require("./config/db")
const app = express()
app.use(helmet());
const PORT = process.env.PORT
const { catchErrors } = require("./middleware/error")
connectDB().catch((err)=>console.error(err))

const authRoutes = require("./routes/auth")
const bookRoutes = require("./routes/book")
const salesTokenRoutes = require("./routes/salesToken")
const paystackRoutes = require("./routes/paystack")
const webHookRoutes = require("./routes/webhooks")

app.use(cors())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/books", bookRoutes)
app.use("/api/v1/sales-token", salesTokenRoutes)
app.use("/api/v1/paystack-services", paystackRoutes)
app.use("/api/v1/webhook", webHookRoutes)








app.use(catchErrors)

app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`)
})
