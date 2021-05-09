const mongoose = require("mongoose");
const stockSchema = require("./stock").schema;
const transactionSchema = require("./transaction").schema;

const userSchema = new mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {type: String},
  date: {type: Date, default: Date.now},  
  wallet: {type: Number, default: 10000},
  stocksBucket: {type: [stockSchema]},
  transactionsBucket: {type: [transactionSchema]}
});
 
module.exports =  mongoose.model("User", userSchema);