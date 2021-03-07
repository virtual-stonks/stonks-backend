const express = require("express");
const router = express.Router();

const { buy, sell } = require("../controllers/stock.js");

router.post("/buy", buy);
router.post("/sell", sell);

module.exports = router;