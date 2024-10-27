const express = require('express');
const sessionController = require('../controllers/sessionController');
const validateSession = require('../middleware/sessionValidator');

const router = express.Router();

module.exports = (redisCache) => {
    router.post('/api/session', /*validateSession,*/ (req, res, next) => {
        req.cache = redisCache; // Attaching redis cache to the request object.
        sessionController.logSession(req, res, next);
    });

    return router;
};