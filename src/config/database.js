const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
  "mongodb+srv://ecommerce:Manu2926@cluster0.rkab7.mongodb.net/?retryWrites=true&w=majority&appName=devTinder"
  );
};

module.exports=connectDB;
