const db = require('../config/db');

exports.getRiwayatPasien = (req, res) => {
  const query = `
    SELECT 
      nama_pasien,
      alamat_pasien,
      COUNT(id) AS total_kunjungan,
      MAX(tanggal_tindakan) AS kunjungan_terakhir,
      SUM(total_nett) AS total_pengeluaran
    FROM transaksi_medis
    GROUP BY nama_pasien, alamat_pasien
    ORDER BY kunjungan_terakhir DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('riwayat_pasien', { pasiens: results || [] });
  });
};

exports.getRiwayatPasienDetail = (req, res) => {
  const namaPasien = req.query.nama;
  const query = `
    SELECT 
      t.*,
      d1.nama AS nama_dokter1,
      d2.nama AS nama_dokter2
    FROM transaksi_medis t
    LEFT JOIN master_dokter d1 ON t.dokter_id = d1.id
    LEFT JOIN master_dokter d2 ON t.dokter2_id = d2.id
    WHERE t.nama_pasien = ?
    ORDER BY t.tanggal_tindakan DESC
  `;
  db.query(query, [namaPasien], (err, results) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('riwayat_pasien_detail', { namaPasien, transaksis: results || [] });
  });
};