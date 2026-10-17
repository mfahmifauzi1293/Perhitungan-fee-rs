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

// 3. Memproses Simpan Booking Online ke Tabel transaksi_medis
exports.simpanBooking = (req, res) => {
  const { 
    nama_pasien, 
    no_ktp, nik, 
    no_hp, 
    dokter_id, 
    jenis_tindakan, tindakan_id, 
    tanggal_tindakan, tanggal_booking, 
    alamat_pasien, keluhan 
  } = req.body;

  // Normalisasi variabel data dari form
  const finalNik = no_ktp || nik || '';
  const finalTindakan = jenis_tindakan || tindakan_id || '';
  const finalTanggalTindakan = tanggal_tindakan || tanggal_booking;
  const finalAlamat = alamat_pasien || keluhan || '';
  const tglBookingHariIni = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Validasi input
  if (!nama_pasien || !finalNik || !no_hp || !dokter_id || !finalTindakan || !finalTanggalTindakan) {
    return res.status(400).json({
      success: false,
      message: 'Harap lengkapi semua data formulir janji temu!'
    });
  }

  // Query INSERT langsung ke tabel transaksi_medis
  const queryInsert = `
    INSERT INTO transaksi_medis (
      no_ktp, 
      nama_pasien, 
      alamat_pasien, 
      tanggal_booking, 
      tanggal_tindakan, 
      jenis_tindakan, 
      dokter_id, 
      status_pembayaran, 
      status_finalisasi
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', 'BELUM_LUNAS')
  `;

  const values = [
    finalNik,
    nama_pasien,
    finalAlamat,
    tglBookingHariIni,
    finalTanggalTindakan,
    finalTindakan,
    dokter_id
  ];

  db.query(queryInsert, values, (err, result) => {
    if (err) {
      console.error("Database Error (Insert transaksi_medis):", err);
      return res.status(500).json({
        success: false,
        message: 'Gagal menyimpan janji temu ke database: ' + err.message
      });
    }

    // Mengembalikan response JSON sukses untuk SweetAlert2
    return res.json({
      success: true,
      message: 'Janji temu Anda berhasil dibuat dan terdaftar di transaksi medis admin!'
    });
  });
};