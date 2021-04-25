const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { buy, sell, holdings, transactions, wallet, tickerlist } = require("../controllers/stock.js");

router.post("/buy", auth, buy);
router.post("/sell", auth, sell);
router.get("/holdings", auth, holdings);
router.get("/transactions", auth, transactions);
router.get("/wallet", auth, wallet);
router.get("/tickerlist", auth, tickerlist);


module.exports = router;