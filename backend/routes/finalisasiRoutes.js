const express = require('express');
const router = express.Router();
const finalisasiController = require('../controllers/finalisasiController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/finalisasi', verifyRole([]), finalisasiController.getFinalisasi);
router.post('/finalisasi/proses/:id', verifyRole([]), finalisasiController.prosesFinalisasi);

module.exports = router;