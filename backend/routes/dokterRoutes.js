const express = require('express');
const router = express.Router();
const dokterController = require('../controllers/dokterController');
const multer = require('multer');
const path = require('path');
const { verifyRole } = require('../controllers/authMiddleware');

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'frontend/public/uploads/'); // Mengarah ke folder frontend/public/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik berdasarkan waktu
  }
});
const upload = multer({ storage: storage });

// Daftar rute (gunakan '/' untuk halaman utama dokter karena app.js sudah mount ke '/')
router.get('/dokter', verifyRole(['admin']), dokterController.getDokter);
router.post('/dokter/tambah', upload.single('foto'), verifyRole(['admin']), dokterController.tambahDokter);
router.post('/dokter/update/:id', upload.single('foto'), verifyRole(['admin']), dokterController.updateDokter);
router.get('/dokter/hapus/:id', verifyRole(['admin']), dokterController.hapusDokter);

module.exports = router;