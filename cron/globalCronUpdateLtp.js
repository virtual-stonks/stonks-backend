const axios = require('axios');
const client = require('../redis/redis_init.js');

// GLOBAL CRON
const cache_exp = 180;
const globalCronUpdateLtp = async () => {
    console.log('GLOBAL CRON RUNNING!');

    axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=false`)
        .then(response => {
            const dummy = [];

            // SET to redis
            const redisValue = JSON.stringify(response.data);
            client.setex('coindata', cache_exp, redisValue, (err, val) => {
                if (err != null) {
                    console.log('Error SETEX in redis!');
                }
            });

            console.log('GLOBAL REDIS SET for coindata');
        })
        .catch((err) => console.log(err))

    axios
        .get(`https://api.binance.com/api/v3/ticker/price`)
        .then(response => {
            const dummy = [];

            response.data.forEach((coin) => {
                // SET to redis        
                let rkey = coin.symbol;
                let rval = coin.price; rval = Number(rval);
                const len = rkey.length;

                if (rkey.slice(-4) == "USDT") {
                    rkey = rkey.substr(0, len - 4);
                    client.setex(rkey, cache_exp, rval, (err, val) => {
                        if (err != null) {
                            console.log('Error SETEX in redis!', val);
                        }
                    });                    
                    dummy.push({ rkey, rval });
                }            
            })

            console.log('GLOBAL REDIS SET for Binance symbols');
        })
        .catch((err) => console.log(err))
}

module.exports = {
    globalCronUpdateLtp
}