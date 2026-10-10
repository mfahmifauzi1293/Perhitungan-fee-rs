const express = require('express');
const router = express.Router();
const cekDokterController = require('../controllers/cekDokterController');

// Route publik cek dokter & jadwal
router.get('/cek-dokter', cekDokterController.getCekDokter);

module.exports = router;