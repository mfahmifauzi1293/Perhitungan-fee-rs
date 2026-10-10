const express = require('express');
const router = express.Router();
const dokterController = require('../controllers/dokterController');

router.get('/dokter', dokterController.getDokter);
router.post('/dokter/tambah', dokterController.tambahDokter);
router.post('/dokter/update/:id', dokterController.updateDokter);
router.get('/dokter/hapus/:id', dokterController.hapusDokter);

module.exports = router;