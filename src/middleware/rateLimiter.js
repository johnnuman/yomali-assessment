const rateLimit = require('express-rate-limit');

// Configure the rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15000, // Limit each IP to 15000 requests per windowMs. this high value is only for assessment.
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Export the rate limiter to be used in other parts of the app
module.exports = limiter;
