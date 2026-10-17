const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// 1. GET / - Halaman Utama (Landing Page Publik)
router.get('/', indexController.getIndexPage);

// 2. POST /register - Memproses Pendaftaran Akun Pasien Baru
router.post('/register', indexController.registerPasien);


module.exports = router;