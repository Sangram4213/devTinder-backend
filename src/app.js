const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const {userAuth} = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // Validation of data

    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.send("User Addded successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) throw new Error("Invalid credential");

    const isPasswordValid = await user.validatePassword(password );

    if (isPasswordValid) {
      const token = await user.getJWT();  

      res.cookie("token", token);

      res.send("Login Successful");
    } else {
      throw new Error("Invalid credential");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
 
app.get("/profile", userAuth,async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest",userAuth,(req,res)=>{
    res.send("Connection Request Sent!"); 
})
connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => console.error("Database cannot be connected!!!!"));
