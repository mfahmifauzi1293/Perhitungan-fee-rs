const db = require('../config/db');

exports.getSuster = (req, res) => {
  db.query("SELECT * FROM master_suster ORDER BY nama ASC", (err, susters) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('suster', { susters: susters || [] });
  });
};

exports.tambahSuster = (req, res) => {
  db.query("INSERT INTO master_suster (nama, peran) VALUES (?, ?)", [req.body.nama, req.body.peran], (err) => {
    if (err) return res.status(500).send("Gagal menambah suster.");
    res.redirect('/suster');
  });
};

exports.updateSuster = (req, res) => {
  db.query("UPDATE master_suster SET nama = ?, peran = ? WHERE id = ?", [req.body.nama, req.body.peran, req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal memperbarui suster.");
    res.redirect('/suster');
  });
};

exports.hapusSuster = (req, res) => {
  db.query("DELETE FROM master_suster WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Gagal menghapus suster.");
    res.redirect('/suster');
  });
};