const rateLimit = require('express-rate-limit');

// Configure the rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Export the rate limiter to be used in other parts of the app
module.exports = limiter;
