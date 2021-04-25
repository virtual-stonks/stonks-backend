const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { coinslist }= require("../controllers/external.js");
const  redis_coindata = require("../redis/redis_coindata");

router.get("/coinslist", auth, redis_coindata, coinslist);

module.exports = router;