const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum:{
        values:["male","female","others"],
        message:'${VALUE} is not valid gender'
      }
    },
    photoUrl: {
      type: String,
      default:"https://banner2.cleanpng.com/20180404/sqe/avhxkafxo.webp",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("PhotoUrl is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about the user!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "Dev@sangramnodejs", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword= async function(passwordInputByUser){
    const user = this;

    const passwordHash = user.password;

    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
