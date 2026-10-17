const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/riwayat-transaksi', verifyRole([]), transaksiController.getRiwayatTransaksi);

module.exports = router;