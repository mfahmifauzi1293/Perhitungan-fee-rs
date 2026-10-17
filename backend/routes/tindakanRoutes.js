const express = require('express');
const router = express.Router();
const tindakanController = require('../controllers/tindakanController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/tindakan', verifyRole(['admin']), tindakanController.getTindakan);
router.post('/tindakan/tambah', verifyRole(['admin']), tindakanController.tambahTindakan);
router.post('/tindakan/update/:id', verifyRole(['admin']), tindakanController.updateTindakan);
router.get('/tindakan/hapus/:id', verifyRole(['admin']), tindakanController.hapusTindakan);

module.exports = router;