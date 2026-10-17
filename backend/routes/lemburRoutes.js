const express = require('express');
const router = express.Router();
const lemburController = require('../controllers/lemburController');
const { verifyRole } = require('../controllers/authMiddleware');

// Rute manajemen lembur (Dilindungi middleware)
router.get('/', verifyRole([]), lemburController.getLemburPage);
router.post('/store', verifyRole([]), lemburController.storeLembur);
router.get('/delete/:id', verifyRole([]), lemburController.deleteLembur);

module.exports = router;