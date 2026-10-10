const db = require('../config/db');

exports.getRiwayatTransaksi = (req, res) => {
  const query = `
    SELECT 
      t.*,
      d1.nama AS nama_dokter1,
      d2.nama AS nama_dokter2,
      da.nama AS nama_dokter_anestesi,
      s1.nama AS nama_suster_op1,
      s2.nama AS nama_suster_op2,
      s3.nama AS nama_suster_op3,
      sr.nama AS nama_suster_rawat
    FROM transaksi_medis t
    LEFT JOIN master_dokter d1 ON t.dokter_id = d1.id
    LEFT JOIN master_dokter d2 ON t.dokter2_id = d2.id
    LEFT JOIN master_dokter da ON t.dokter_anestesi_id = da.id
    LEFT JOIN master_suster s1 ON t.suster_op1_id = s1.id
    LEFT JOIN master_suster s2 ON t.suster_op2_id = s2.id
    LEFT JOIN master_suster s3 ON t.suster_op3_id = s3.id
    LEFT JOIN master_suster sr ON t.suster_rawat_id = sr.id
    WHERE t.status_finalisasi = 'DONE_FINALISASI'
    ORDER BY t.tanggal_tindakan DESC, t.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    res.render('riwayat_transaksi', { transaksis: results || [] });
  });
};