const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/trackerController');

router.get('/tracker.js', trackerController.serve);

router.get('/tracker-demo.html', trackerController.serveDemoPage);

module.exports = router;
