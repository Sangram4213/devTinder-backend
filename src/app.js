const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // Validation of data

    validateSignUpData(req);

    const {password} = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);


    const user = new User(req.body);
    await user.save();

    res.send("User Addded successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: "+ err.message);
  }
});

app.get("/user", async (req, res) => {
    try {
    const email = req.body.emailId;
    const user = await User.find({ emailId: email });

    if (!user) res.status(404).send("Something went wrong");

    res.send(user);
  } catch (err) {
    console.error("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) res.send("Something went wrong!!");

    res.send("User is deleted!!");
  } catch (err) {
    console.log("Something went wrong!");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});

    res.send(user);
  } catch (err) {
    console.error("Something went wrong");
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const ALLOWED_UPDATES = [
      "id",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) res.status(400).send("Updated not allowed");

    if (data?.skills.length > 10) throw new Error("Skills is more than 10");

    const updatedUser = await User.findByIdAndUpdate({ _id: id }, data, {});
    if (!updatedUser) res.send("Something Went wrong");
    res.send("User updated Successfully");
  } catch (err) {
    console.log("Something went wrong");
  }
});
connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => console.error("Database cannot be connected!!!!"));
