const redis = require("redis");
const globals = require("../../defs/globals");

const redisClient = redis.createClient({
  url: globals.redisUrl,
  password: globals.redisPassword,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = redisClient;
