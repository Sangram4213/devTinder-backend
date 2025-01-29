const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("../src/routes/auth");
const profileRouter = require('../src/routes/profile');
const requestRouter = require('../src/routes/request');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

//Router

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => console.error("Database cannot be connected!!!!"));
