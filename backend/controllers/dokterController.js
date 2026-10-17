const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file menggunakan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'frontend/public/uploads/'); // Mengarah ke folder frontend/public/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik berdasarkan waktu
  }
});
const upload = multer({ storage: storage });

// Middleware export untuk upload foto tunggal
exports.uploadFoto = upload.single('foto');

exports.getDokter = (req, res) => {
  db.query("SELECT * FROM master_dokter ORDER BY id ASC", (err, dokters) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('dokter', { dokters: dokters || [] });
  });
};

exports.tambahDokter = (req, res) => {
  const { nama, fokus, jadwal } = req.body;
  const foto = req.file ? req.file.filename : null;

  const query = "INSERT INTO master_dokter (nama, fokus, jadwal, foto) VALUES (?, ?, ?, ?)";
  db.query(query, [nama, fokus, jadwal, foto], (err) => {
    if (err) return res.status(500).send("Gagal menambah dokter: " + err.message);
    res.redirect('/dokter');
  });
};

exports.updateDokter = (req, res) => {
  const { nama, fokus, jadwal } = req.body;
  const dokterId = req.params.id;
  const fotoBaru = req.file ? req.file.filename : null;

  if (fotoBaru) {
    // Jika user mengunggah foto baru
    const query = "UPDATE master_dokter SET nama = ?, fokus = ?, jadwal = ?, foto = ? WHERE id = ?";
    db.query(query, [nama, fokus, jadwal, fotoBaru, dokterId], (err) => {
      if (err) return res.status(500).send("Gagal memperbarui dokter: " + err.message);
      res.redirect('/dokter');
    });
  } else {
    // Jika foto tidak diubah
    const query = "UPDATE master_dokter SET nama = ?, fokus = ?, jadwal = ? WHERE id = ?";
    db.query(query, [nama, fokus, jadwal, dokterId], (err) => {
      if (err) return res.status(500).send("Gagal memperbarui dokter: " + err.message);
      res.redirect('/dokter');
    });
  }
};

exports.hapusDokter = (req, res) => {
  db.query("DELETE FROM master_dokter WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal menghapus dokter.");
    res.redirect('/dokter');
  });
};