const db = require('../config/db');

// 1. Tampil Data Tindakan
exports.getTindakan = (req, res) => {
  db.query("SELECT * FROM master_tindakan ORDER BY nama_tindakan ASC", (err, tindakans) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('tindakan', { tindakans: tindakans || [] });
  });
};

// 2. Tambah Tindakan (Menambahkan deskripsi)
exports.tambahTindakan = (req, res) => {
  const { nama_tindakan, deskripsi, harga_standar } = req.body;
  const sql = "INSERT INTO master_tindakan (nama_tindakan, deskripsi, harga_standar) VALUES (?, ?, ?)";

  db.query(sql, [nama_tindakan, deskripsi || '', harga_standar || 0], (err) => {
    if (err) return res.status(500).send("Gagal menambah tindakan: " + err.message);
    res.redirect('/tindakan');
  });
};

// 3. Update Tindakan (Menambahkan deskripsi)
exports.updateTindakan = (req, res) => {
  const { nama_tindakan, deskripsi, harga_standar } = req.body;
  const sql = "UPDATE master_tindakan SET nama_tindakan = ?, deskripsi = ?, harga_standar = ? WHERE id = ?";

  db.query(sql, [nama_tindakan, deskripsi || '', harga_standar || 0, req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal memperbarui tindakan: " + err.message);
    res.redirect('/tindakan');
  });
};

// 4. Hapus Tindakan
exports.hapusTindakan = (req, res) => {
  db.query("DELETE FROM master_tindakan WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal menghapus tindakan: " + err.message);
    res.redirect('/tindakan');
  });
};