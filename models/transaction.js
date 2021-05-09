const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  stockName: { type: String, required:  true },
  isBuy: {type: Boolean, default: true},
  qty: {type: Number, default: 0},
  cost: {type: Number, default: 0},
  date : {type: Date, default: Date.now},
  image: {type: String},
  wallet: {type: Number}
});

module.exports = mongoose.model("Transaction", transactionSchema);