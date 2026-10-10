const express = require('express');
const router = express.Router();
const layananController = require('../controllers/layananController');

// Route menampilkan semua layanan
router.get('/layanan', layananController.getLayanan);

// Route dinamis berdasarkan kategori (/layanan/bedah, /layanan/treatment, /layanan/konsultasi)
router.get('/layanan/:kategori', layananController.getLayanan);

module.exports = router;