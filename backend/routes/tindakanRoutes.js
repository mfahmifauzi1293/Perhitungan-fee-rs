const express = require('express');
const router = express.Router();
const tindakanController = require('../controllers/tindakanController');

router.get('/tindakan', tindakanController.getTindakan);
router.post('/tindakan/tambah', tindakanController.tambahTindakan);
router.post('/tindakan/update/:id', tindakanController.updateTindakan);
router.get('/tindakan/hapus/:id', tindakanController.hapusTindakan);

module.exports = router;