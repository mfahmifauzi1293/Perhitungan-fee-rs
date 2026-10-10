const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Halaman Authentication (Login & Logout)
router.get('/login', authController.getLoginPage);
router.post('/login', authController.processLogin);
router.get('/logout', authController.logout);

module.exports = router;