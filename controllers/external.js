const axios = require('axios');
const client = require('../redis/redis_init.js');

const coinslist = async (req, res) => {
    console.log('Coinslist hit!')
    try {
        const coinsData = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=false');

        // SET to redis
        const redisValue = JSON.stringify(coinsData.data);
        client.setex('coindata', 300, redisValue, (err, val) => {
            if (err != null) {
                console.log('Error SETEX in redis!');
            }
        });

        // return json
        res.status(201).json(coinsData.data);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    coinslist
}