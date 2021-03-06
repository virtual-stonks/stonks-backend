const UserModel = require("../models/user.js");
const client = require('../redis/redis_init.js');

// CRON
const userStockCronUpdateLtp = async (user_id) => {
    console.log('user cron', user_id);
    try {
        const user = await UserModel.findById(user_id);
        console.log(user.stocksBucket);

        // call a loop of GET to Redis & save to DB        
        for (let i = 0; i < user.stocksBucket.length; i++) {
            const { stockName, _id } = user.stocksBucket[i];
            // console.log(stockName, _id);

            client.get(stockName, async (err, data) => {
                if (err) {
                    console.log('REDIS ERROR!')
                };
                if (data != null) {
                    // console.log('Cache HIT!', `before ${stockName} - ${user.stocksBucket[i].ltp}`);                            
                    const doc = await UserModel.findOneAndUpdate({
                        "_id": user_id, "stocksBucket._id": _id
                    }, {
                        "stocksBucket.$.ltp": data
                    });                    
                } else {
                    console.log('CACHE MISS!');
                }
            })
        }

                                            
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    userStockCronUpdateLtp
}