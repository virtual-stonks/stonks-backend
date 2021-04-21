const jwt = require("jsonwebtoken");
const axios = require("axios");

const UserModel = require("../models/user.js");
const StockModel = require("../models/stock.js");

const buy = async (req,res) => {    
    var {qty, price, stockName} = req.query;
    qty = Number(qty); price = Number(price);

    const user = await UserModel.findById(req.user.id);
    try{
        if(user.wallet < qty * price)
            return res.status(400).json({ errors: [{message: "Wallet insufficient."}] });
        user.wallet -= qty * price;

        var isBought = false;
        for(var i = 0; i < user.stocksBucket.length; i++){
            if(user.stocksBucket[i].name == stockName){
                user.stocksBucket[i].ltp = price;
                user.stocksBucket[i].qty += qty; 
                user.stocksBucket[i].investedVal += qty * price;
                
                isBought = true; break; 
            }
        }

        if(!isBought){
            const newStock = await StockModel.create({ name : stockName, 
                                                       qty,
                                                       investedVal : qty * price,
                                                       currentVal : qty * price, 
                                                       ltp: price});
            user.stocksBucket.push(newStock);
        }

        await user.save();
        res.json({msg: "SUCCESS", qty, price, stockName});
    } catch(err){
        console.log(err);
        res.status(400).json({msg: "Failed to buy stock"});
    }
}

const sell = async (req,res) => {
    var {qty, price, stockName} = req.query;
    qty = Number(qty); price = Number(price);

    const user = await UserModel.findById(req.user.id);
    try{
        var isBought = false;
        for(var i = user.stocksBucket.length - 1; i >= 0 ; i--){
            if(user.stocksBucket[i].name == stockName){
                if(user.stocksBucket[i].qty < qty)
                    return res.status(400).json({ errors: [{message: "Invalid sell request"}] });
                
                user.stocksBucket[i].qty -= qty;
                user.stocksBucket[i].ltp = price;
                user.stocksBucket[i].investedVal -= qty * price;
                user.stocksBucket[i].currentVal = user.stocksBucket[i].qty * price;

                user.wallet += qty * price;

                isBought = true; break; 
            }
        }

        if(!isBought)
            return res.status(400).json({ errors: [{message: "Stock not bought"}] });
    
        await user.save();
        res.json({msg: "SUCCCESS", qty, price, stockName});
    } catch(err){
        console.log(err);
        res.status(400).json({msg: "Failed to sell stock"});    
    }
}

const holdings = async (req, res) => {
    try {
      const stockPriceUpdt = await axios.get(`https://finnhub.io/api/v1/quote?symbol=MSFT&token=${process.env.FINNHUB_TOKEN}`);        
      console.log(stockPriceUpdt.data);
      res.json({payload: stockPriceUpdt.data});
    } catch (err) {
        console.log(err);
        res.status(400).json({msg: "Error"});
    }
}

module.exports = {
    buy,
    sell,
    holdings
}
