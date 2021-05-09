const client = require('../redis/redis_init.js');

// Cache middleware
const cache_trendingdata = (req, res, next) => {	
	client.get('trendingdata', (err, data) => {
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

module.exports = cache_trendingdata;