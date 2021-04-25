const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  stockName: { type: String, required:  true },
  isBuy: {type: Boolean, default: true},
  qty: {type: Number, default: 0},
  cost: {type: Number, default: 0},
  date : {type: Date, default: Date.now}
});

module.exports = mongoose.model("Transaction", transactionSchema);