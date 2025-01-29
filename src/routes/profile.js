const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInuser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));

    await loggedInuser.save();

    res.json({
      message: `${loggedInuser.firstName} ${loggedInuser.lastName} your profile updated successfully`,
      data: loggedInuser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { updatedPassword } = req.body;

    if (!validator.isStrongPassword(updatedPassword)) {
      throw new Error("Updated password is weak");
    }

    const isPasswordIsMatch = loggedInUser.validatePassword(updatedPassword);

    if (!isPasswordIsMatch) throw new Error("Password is not correct");

    const passwordHash = await bcrypt.hash(updatedPassword, 10);

    loggedInUser.password = passwordHash;

    await loggedInUser.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send("Error: "+ err.message);
  }
});

module.exports = profileRouter;
