const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { buy, sell } = require("../controllers/stock.js");

router.post("/buy", auth, buy);
router.post("/sell", auth, sell);

module.exports = router;