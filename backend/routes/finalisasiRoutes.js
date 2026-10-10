const express = require('express');
const router = express.Router();
const finalisasiController = require('../controllers/finalisasiController');

router.get('/finalisasi', finalisasiController.getFinalisasi);
router.post('/finalisasi/proses/:id', finalisasiController.prosesFinalisasi);

module.exports = router;