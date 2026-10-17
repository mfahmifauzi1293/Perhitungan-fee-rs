const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file menggunakan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'frontend/public/uploads/'); // Mengarah ke folder penyimpanan foto suster
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik berdasarkan waktu
  }
});
const upload = multer({ storage: storage });

exports.uploadFoto = upload.single('foto');

exports.getSuster = (req, res) => {
  db.query("SELECT * FROM master_suster ORDER BY nama ASC", (err, susters) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('suster', { susters: susters || [] });
  });
};

exports.tambahSuster = (req, res) => {
  const { nama, peran } = req.body;
  const foto = req.file ? req.file.filename : null;

  const query = "INSERT INTO master_suster (nama, peran, foto) VALUES (?, ?, ?)";
  db.query(query, [nama, peran, foto], (err) => {
    if (err) return res.status(500).send("Gagal menambah suster: " + err.message);
    res.redirect('/suster');
  });
};

exports.updateSuster = (req, res) => {
  const { nama, peran } = req.body;
  const susterId = req.params.id;
  const fotoBaru = req.file ? req.file.filename : null;

  if (fotoBaru) {
    // Jika user mengunggah foto baru
    const query = "UPDATE master_suster SET nama = ?, peran = ?, foto = ? WHERE id = ?";
    db.query(query, [nama, peran, fotoBaru, susterId], (err) => {
      if (err) return res.status(500).send("Gagal memperbarui suster: " + err.message);
      res.redirect('/suster');
    });
  } else {
    // Jika foto tidak diubah
    const query = "UPDATE master_suster SET nama = ?, peran = ? WHERE id = ?";
    db.query(query, [nama, peran, susterId], (err) => {
      if (err) return res.status(500).send("Gagal memperbarui suster: " + err.message);
      res.redirect('/suster');
    });
  }
};

exports.hapusSuster = (req, res) => {
  db.query("DELETE FROM master_suster WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal menghapus suster.");
    res.redirect('/suster');
  });
};