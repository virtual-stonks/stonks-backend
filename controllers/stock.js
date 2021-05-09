const jwt = require("jsonwebtoken");
const axios = require("axios");

const UserModel = require("../models/user.js");
const StockModel = require("../models/stock.js");
const TransactionModel = require("../models/transaction.js");

const buy = async (req, res) => {
    let { qty, price, stockName, image } = req.query;

    console.log('body', image);
    const { email, id } = req.user;
    qty = Number(qty);
    price = Number(price);

    if (qty <= 0)
        return res.status(400).json({ msg: "BUY failed! 0 quantity selected!" });

    try {
        const user = await UserModel.findById(req.user.id);
        if (user.wallet < qty * price)
            return res.status(400).json({ msg: "BUY failed! Wallet insufficient." });
        user.wallet -= qty * price;

        let isBought = false;
        for (let i = 0; i < user.stocksBucket.length; i++) {
            if (user.stocksBucket[i].stockName == stockName) {
                user.stocksBucket[i].ltp = price;
                user.stocksBucket[i].qty += qty;
                user.stocksBucket[i].investedVal += qty * price;
                isBought = true;
                break;
            }
        }

        if (!isBought) {
            const newStock = new StockModel({
                stockName,
                qty,
                investedVal: qty * price,
                ltp: price,
                image
            });
            user.stocksBucket.push(newStock);
        }

        const newTransaction = new TransactionModel({
            stockName,
            isBuy: true,
            qty,
            cost: qty * price,
            image
        });
        user.transactionsBucket.unshift(newTransaction);

        await user.save();
        res.status(200).json({ msg: "SUCCESS", payload: { qty, price, stockName } });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: "BUY stock Failed!" });
    }
}

const sell = async (req, res) => {
    let { qty, price, stockName, image } = req.query;
    console.log('sell img', image);
    qty = Number(qty);
    price = Number(price);
    const { email, id } = req.user;

    if (qty <= 0)
        return res.status(400).json({ msg: "SELL failed! 0 quantity selected!" });

    try {
        const user = await UserModel.findById(req.user.id);
        let isBought = false;

        for (let i = 0; i < user.stocksBucket.length; i++) {
            if (user.stocksBucket[i].stockName == stockName) {
                const {
                    stockName: uStockName,
                    ltp: ultp,
                    qty: uqty,
                    investedVal: uinvestedVal
                } = user.stocksBucket[i];

                // check if sufficient qt of stocks
                if (qty > uqty)
                    return res.status(400).json({ msg: "SELL failed! Holdings insufficient." });

                let abp = uinvestedVal / uqty;
                let lostInvestment = abp * qty;
                user.stocksBucket[i].investedVal -= lostInvestment;
                user.stocksBucket[i].qty -= qty;
                user.stocksBucket[i].ltp = price;

                // if 0 qts remain, remove the stock
                if (user.stocksBucket[i].qty === 0) {
                    user.stocksBucket.splice(i, 1);
                }

                //update wallet by currentval
                let gainWallet = qty * price;
                user.wallet += gainWallet;
                isBought = true;
                break;
            }
        }

        if (!isBought)
            return res.status(400).json({ msg: "SELL failed! No such stock in holdings" });

        const newTransaction = new TransactionModel({
            stockName,
            isBuy: false,
            qty,
            cost: qty * price,
            image
        });

        user.transactionsBucket.unshift(newTransaction);

        await user.save();
        res.json({ msg: "SUCCCESS", payload: { qty, price, stockName } });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: "SELL failed!" });
    }
}

const holdings = async (req, res) => {
    try {
        const userStocks = await UserModel.findById(req.user.id).select("stocksBucket");
        res.status(201).json(userStocks);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

const transactions = async (req, res) => {
    try {
        const transactionsList = await UserModel.findById(req.user.id).select("transactionsBucket");
        res.status(201).json(transactionsList);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

const wallet = async (req, res) => {
    try {
        const userWallet = await UserModel.findById(req.user.id).select("wallet");
        res.status(201).json(userWallet);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

const tickerlist = async (req, res) => {
    try {
        const userStocks = await UserModel.findById(req.user.id).select("stocksBucket");
        const tickers = [];
        for (let i = 0; i < userStocks.stocksBucket.length; i++) {
            tickers.push(userStocks.stocksBucket[i].stockName.toLowerCase() + "usdt@miniTicker");
        }

        res.status(201).json(tickers);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

module.exports = {
    buy,
    sell,
    holdings,
    transactions,
    wallet,
    tickerlist,      
}