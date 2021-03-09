const axios = require("axios");
const UserModal = require("../models/user.js");

const buy = (req,res) => {    
    const {qty, price, stockName} = req.query;
    // wallet check
    
    // if bought before, updt


    // if new stock, new stock + add to array

    // save
    res.json({msg: "SUCCESS", qty, price, stockName});
}

const sell = (req,res) => {
    const {qty, price, stockName} = req.query;    
    res.json({msg: "SUCCCESS", qty, price, stockName});
}

const holdings = async (req, res) => {
    // code

    // get last price
    try {
      const stockPriceUpdt = await axios.get(`https://finnhub.io/api/v1/quote?symbol=MSFT&token=${process.env.FINNHUB_TOKEN}`)        
      console.log(stockPriceUpdt.data);
      res.json({payload: stockPriceUpdt.data});
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: "Error "})
    }
}

module.exports = {
    buy,
    sell,
    holdings
}
