const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
  "mongodb+srv://tempmail4213:kUYWh6jUoPdWuJsk@nodejs.bouqx.mongodb.net/?retryWrites=true&w=majority&appName=Nodejs"
  );
};

module.exports=connectDB;
