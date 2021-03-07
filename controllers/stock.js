
const UserModal = require("../models/user.js");

const buy = (req,res) => {    
    const {qty, price, stockName} = req.query;    
    res.json({msg: "SUCCESS", qty, price, stockName});
}

const sell = (req,res) => {
    const {qty, price, stockName} = req.query;    
    res.json({msg: "SUCCCESS", qty, price, stockName});
}

module.exports = {
    buy,
    sell
}
