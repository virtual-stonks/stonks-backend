const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { signin, signup, userDetails }= require("../controllers/user.js");
const { userValidationRulesSignin, userValidationRulesSignup, validate } = require("../middleware/userValidator")


router.post("/signin", userValidationRulesSignin(), validate, signin);
router.post("/signup", userValidationRulesSignup(), validate, signup);
router.get("/userdetails", auth, userDetails);

module.exports = router;