const express = require('express');
const router = express.Router();
const susterController = require('../controllers/susterController');

router.get('/suster', susterController.getSuster);
router.post('/suster/tambah', susterController.tambahSuster);
router.post('/suster/update/:id', susterController.updateSuster);
router.get('/suster/hapus/:id', susterController.hapusSuster);

module.exports = router;