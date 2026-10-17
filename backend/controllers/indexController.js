const db = require('../config/db');

// 1. Render Halaman Utama (Landing Page Publik)
exports.getIndexPage = (req, res) => {
  const queryTindakan = "SELECT id, nama_tindakan, kategori FROM master_tindakan ORDER BY nama_tindakan ASC";
  const queryDokter = "SELECT id, nama, fokus AS spesialis, fokus, jadwal FROM master_dokter ORDER BY nama ASC";

  db.query(queryTindakan, (err, tindakans) => {
    if (err) {
      console.error("Error Query Tindakan Landing Page:", err);
    }

    db.query(queryDokter, (errDokter, dokters) => {
      if (errDokter) {
        console.error("Error Query Dokter Landing Page:", errDokter);
      }

      res.render('index', {
        user: req.session.user || null,
        tindakans: tindakans || [],
        dokters: dokters || []
      });
    });
  });
};

// 2. Memproses Pendaftaran Akun Pasien Baru (dari Modal Register Pop-up)
exports.registerPasien = (req, res) => {
  const { nama, username, password, no_hp } = req.body;

  // Validasi input
  if (!nama || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nama, username, dan password wajib diisi!'
    });
  }

  // Cek apakah username / email sudah terdaftar
  const checkQuery = "SELECT id FROM users WHERE username = ? LIMIT 1";

  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error("Database Error (Check User):", err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan sistem pada database.'
      });
    }

    if (results && results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username / Email sudah terdaftar! Silakan gunakan username lain.'
      });
    }

    // Insert user baru dengan role 'pasien'
    const insertQuery = "INSERT INTO users (nama, username, password, no_hp, role) VALUES (?, ?, ?, ?, 'pasien')";

    db.query(insertQuery, [nama, username, password, no_hp || null], (err, result) => {
      if (err) {
        console.error("Database Error (Insert User):", err);
        return res.status(500).json({
          success: false,
          message: 'Gagal melakukan pendaftaran akun.'
        });
      }

      // Kirim respon sukses JSON ke AJAX frontend
      return res.json({
        success: true,
        message: 'Pendaftaran akun berhasil! Silakan login dengan akun Anda.'
      });
    });
  });
};