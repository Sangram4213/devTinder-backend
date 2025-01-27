const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Email is not valid");
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){  
            throw new Error("Enter a Strong Password");
        }
      }
    }, 
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value))
          throw new Error("Gender data is not valid");
      },
    },
    photoUrl: {
      type: String,
      validate(value){
        if(!validator.isURL(value)){
            throw new Error("PhotoUrl is not valid");
        }
      }
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

const User = mongoose.model("User", userSchema);

module.exports = User;
