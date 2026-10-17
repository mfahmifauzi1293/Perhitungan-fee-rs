const express = require('express');
const router = express.Router();
const fasilitasController = require('../controllers/fasilitasController');


// Rute GET /fasilitas
router.get('/', fasilitasController.getFasilitas);

module.exports = router;