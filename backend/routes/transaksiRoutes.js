const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

router.get('/riwayat-transaksi', transaksiController.getRiwayatTransaksi);

module.exports = router;