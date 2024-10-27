const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.connect().catch(console.error);

const getAsync = (key) => redisClient.get(key);
const setAsync = (key, value) => redisClient.set(key, value);
const delAsync = (key) => redisClient.del(key);

redisClient.on('connect', () => {
    console.log('Connected to Redis...');
});
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = {
    getAsync,
    setAsync,
    delAsync
};