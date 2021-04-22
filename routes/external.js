const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { coinslist }= require("../controllers/external.js");

router.get("/coinslist", auth, coinslist);

module.exports = router;