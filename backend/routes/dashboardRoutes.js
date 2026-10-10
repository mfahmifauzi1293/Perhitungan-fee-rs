const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Ubah dari '/' menjadi '/dashboard'
router.get('/dashboard', dashboardController.getDashboard);

module.exports = router;