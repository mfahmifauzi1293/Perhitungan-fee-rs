const db = require('../config/db');

exports.getLaporan = (req, res) => {
  const jenis = req.query.jenis || 'dokter';
  const bulan = req.query.bulan || new Date().toISOString().slice(0, 7);

  if (jenis === 'dokter') {
    // Query untuk Dokter (Menggabungkan fee & tindakan dari Dokter 1 dan Dokter 2)
    const q = `
      SELECT 
        d.nama, 
        d.fokus, 
        COUNT(rekap.transaksi_id) AS total_tindakan, 
        IFNULL(SUM(rekap.fee), 0) AS total_fee
      FROM master_dokter d
      LEFT JOIN (
        -- Data Transaksi Dokter 1
        SELECT id AS transaksi_id, dokter_id AS dokter_id, fee_dokter1 AS fee, tanggal_tindakan
        FROM transaksi_medis
        WHERE status_finalisasi = 'DONE_FINALISASI' 
          AND dokter_id IS NOT NULL 
          AND DATE_FORMAT(tanggal_tindakan, '%Y-%m') = ?

        UNION ALL

        -- Data Transaksi Dokter 2
        SELECT id AS transaksi_id, dokter2_id AS dokter_id, fee_dokter2 AS fee, tanggal_tindakan
        FROM transaksi_medis
        WHERE status_finalisasi = 'DONE_FINALISASI' 
          AND dokter2_id IS NOT NULL 
          AND DATE_FORMAT(tanggal_tindakan, '%Y-%m') = ?
      ) rekap ON d.id = rekap.dokter_id
      GROUP BY d.id, d.nama, d.fokus
      ORDER BY total_fee DESC
    `;

    db.query(q, [bulan, bulan], (err, laporans) => {
      if (err) return res.status(500).send("Database Error: " + err.message);
      res.render('laporan', { jenis, bulan, laporans: laporans || [] });
    });

  } else {
    // Query untuk Perawat / Suster
    const q = `
      SELECT 
        s.nama, 
        s.peran, 
        COUNT(t.id) AS total_tindakan
      FROM master_suster s 
      LEFT JOIN transaksi_medis t ON (
        s.id = t.suster_op1_id OR 
        s.id = t.suster_op2_id OR 
        s.id = t.suster_op3_id OR 
        s.id = t.suster_rawat_id
      ) 
      AND t.status_finalisasi = 'DONE_FINALISASI' 
      AND DATE_FORMAT(t.tanggal_tindakan, '%Y-%m') = ?
      GROUP BY s.id, s.nama, s.peran
      ORDER BY total_tindakan DESC
    `;

    db.query(q, [bulan], (err, laporans) => {
      if (err) return res.status(500).send("Database Error: " + err.message);
      res.render('laporan', { jenis, bulan, laporans: laporans || [] });
    });
  }
};