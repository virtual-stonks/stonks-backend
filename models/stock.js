const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
  name: { type: String, required:  true },
  qty: {type: Number, default: 0},
  investedVal: {type: Number},
  currentVal: {type: Number},
  ltp: {type: Number}
});

module.exports = mongoose.model("Stock", stockSchema);