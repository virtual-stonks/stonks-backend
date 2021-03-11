const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { buy, sell, holdings } = require("../controllers/stock.js");

router.post("/buy", auth, buy);
router.post("/sell", auth, sell);
router.get("/holdings", auth, holdings);

module.exports = router;