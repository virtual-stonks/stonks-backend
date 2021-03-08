const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { signin, signup, userDetails }= require("../controllers/user.js");
const { userValidationRules, validate } = require("../middleware/userValidator")


router.post("/signin", userValidationRules(), validate, signin);
router.post("/signup", userValidationRules(), validate, signup);
router.get("/userdetails", auth, userDetails);

module.exports = router;