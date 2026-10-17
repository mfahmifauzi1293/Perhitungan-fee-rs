const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/riwayat-pasien', verifyRole(['admin']), pasienController.getRiwayatPasien);
router.get('/riwayat-pasien/detail', verifyRole(['admin']), pasienController.getRiwayatPasienDetail);

module.exports = router;