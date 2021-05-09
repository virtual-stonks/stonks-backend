const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  stockName: { type: String, required:  true },
  qty: {type: Number, default: 0},
  investedVal: {type: Number},  
  ltp: {type: Number},
  image: {type: String}
});

module.exports = mongoose.model("Stock", stockSchema);