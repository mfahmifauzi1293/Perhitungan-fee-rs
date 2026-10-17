const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyRole } = require('../controllers/authMiddleware');

// Ubah dari '/' menjadi '/dashboard'
router.get('/dashboard',verifyRole(['admin']), dashboardController.getDashboard);

module.exports = router;