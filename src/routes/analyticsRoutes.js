const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/domains', analyticsController.getAllDomains);
router.get('/visits', analyticsController.getVisitsByDate);
router.get('/browsers', analyticsController.getBrowserStats);
router.get('/devices', analyticsController.getDeviceStats);

module.exports = router;
