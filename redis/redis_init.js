const redis = require('redis')
const dotenv = require('dotenv');
dotenv.config();

// const REDIS_PORT = process.env.REDIS_URL || 6379;
// const client = redis.createClient(REDIS_PORT);
const client = redis.createClient({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

client.on('connect', () => {
  console.log('Client connected to redis-cloud...', process.env.REDIS_HOSTNAME, process.env.REDIS_PORT)
})

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...')
})

client.on('error', (err) => {
  console.log(err.message)
  client.quit()
})

client.on('end', () => {
  console.log('Client disconnected from redis')
})

process.on('SIGINT', () => {
  client.quit()
})

module.exports = client