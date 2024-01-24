const express = require("express");
require("dotenv").config();
const app = express();
const dbConn = require("./config/dbCon");
const mongoose = require("mongoose");

app.use(express.json());

dbConn();


app.use('/api/v1',require('./routes/userRoute'))

app.use('/api/v2' , require('./routes/accountRoute'))

mongoose.connection.once("open", () => {
  console.log("Mongoose connected");
  app.listen(process.env.PORT, () => {
    console.log(`The server running on port ${process.env.PORT}`);
  });
});
