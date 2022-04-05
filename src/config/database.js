const mongoose = require('mongoose')
require("dotenv").config()
const { config } = process.env

console.log("port" + process.env.MONGO_URI)
exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};