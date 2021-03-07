const mongoose = require("mongoose");
const stockSchema = require("./stock").schema;

const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {type: String},
  date: {type: Date, default: Date.now},  
  wallet: {type: Number, default: 10000},
  stocksBucket: {type: [stockSchema]}
});
 
module.exports =  mongoose.model("User", userSchema);