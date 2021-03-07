const express = require("express");
const router = express.Router();

const { signin, signup }= require("../controllers/user.js");
const { userValidationRules, validate } = require("../middleware/userValidator")


router.post("/signin", userValidationRules(), validate, signin);
router.post("/signup", userValidationRules(), validate, signup);

module.exports = router;