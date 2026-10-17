const express = require('express');
const router = express.Router();
const susterController = require('../controllers/susterController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/suster', verifyRole([]), susterController.getSuster);
router.post('/suster/tambah', verifyRole([]), susterController.uploadFoto, susterController.tambahSuster);
router.post('/suster/update/:id', verifyRole([]), susterController.uploadFoto, susterController.updateSuster);
router.get('/suster/hapus/:id', verifyRole([]), susterController.hapusSuster);

module.exports = router;