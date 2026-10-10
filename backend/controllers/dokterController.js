const db = require('../config/db');

exports.getDokter = (req, res) => {
  db.query("SELECT * FROM master_dokter ORDER BY id ASC", (err, dokters) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('dokter', { dokters: dokters || [] });
  });
};

exports.tambahDokter = (req, res) => {
  db.query("INSERT INTO master_dokter (nama, spesialis, fokus) VALUES (?, ?, ?)", [req.body.nama, req.body.spesialis, req.body.fokus], (err) => {
    if (err) return res.status(500).send("Gagal menambah dokter.");
    res.redirect('/dokter');
  });
};

exports.updateDokter = (req, res) => {
  db.query("UPDATE master_dokter SET nama = ?, spesialis = ?, fokus = ? WHERE id = ?", [req.body.nama, req.body.spesialis, req.body.fokus, req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal memperbarui dokter.");
    res.redirect('/dokter');
  });
};

exports.hapusDokter = (req, res) => {
  db.query("DELETE FROM master_dokter WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal menghapus dokter.");
    res.redirect('/dokter');
  });
};