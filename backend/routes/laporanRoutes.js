const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/laporan', verifyRole([]), laporanController.getLaporan);
router.get('/api/laporan/rincian', verifyRole([]), laporanController.getDetailRincian);

module.exports = router;