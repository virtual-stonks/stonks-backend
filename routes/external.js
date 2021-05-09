const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { coinslist, trending }= require("../controllers/external.js");
const  redis_coindata = require("../redis/redis_coindata");
const  redis_trendingdata = require("../redis/redis_trendingdata");

router.get("/coinslist", auth, redis_coindata, coinslist);
router.get("/trending", auth, redis_trendingdata, trending);

module.exports = router;