const axios = require('axios');

const coinslist = async (req, res) => {
    try {
        const coinsData = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=false');        
        res.status(201).json(coinsData.data);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error" });   
    }
}

module.exports = {
    coinslist
}