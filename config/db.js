const mongoose = require("mongoose");
const { URI } = require("../utils/constants");

async function connectDB() {
   mongoose.connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );

  const db = mongoose.connection
  db.once("connected", ()=>console.log(`database connected`))
  db.on("error", ()=>console.log("db connection error"))
}

module.exports = { connectDB };
