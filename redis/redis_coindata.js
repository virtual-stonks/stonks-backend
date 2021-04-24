const client = require('../redis/redis_init.js');

// Cache middleware
const cache_coindata = (req, res, next) => {	
	client.get('coindata', (err, data) => {
		if(err) {
			console.log('REDIS ERROR!')
		};
		if(data != null){
			console.log('Cache HIT!')
			res.status(201).json(JSON.parse(data));
		}else{
			console.log('CACHE MISS!')
			next();
		}
	})	
}

module.exports = cache_coindata;