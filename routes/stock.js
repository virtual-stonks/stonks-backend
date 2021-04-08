const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { buy, sell, holdings, wallet } = require("../controllers/stock.js");

router.post("/buy", auth, buy);
router.post("/sell", auth, sell);
router.get("/holdings", auth, holdings);
router.get("/wallet", auth, wallet);


module.exports = router;