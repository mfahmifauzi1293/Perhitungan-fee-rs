const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');

router.get('/riwayat-pasien', pasienController.getRiwayatPasien);
router.get('/riwayat-pasien/detail', pasienController.getRiwayatPasienDetail);

module.exports = router;