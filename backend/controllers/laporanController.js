const db = require('../config/db');

exports.getLaporan = (req, res) => {
  const jenis = req.query.jenis || 'dokter';
  
  const today = new Date().toISOString().slice(0, 10);
  const defaultMulai = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  
  const tanggalMulai = (req.query.tanggal_mulai && req.query.tanggal_mulai.trim() !== '') ? req.query.tanggal_mulai : defaultMulai;
  const tanggalSelesai = (req.query.tanggal_selesai && req.query.tanggal_selesai.trim() !== '') ? req.query.tanggal_selesai : today;

  if (jenis === 'dokter') {
    const q = `
      SELECT
        d.id,
        d.nama,
        d.fokus,
        COUNT(rekap.transaksi_id) AS total_tindakan,
        IFNULL(SUM(rekap.fee), 0) AS total_fee
      FROM master_dokter d
      LEFT JOIN (
        SELECT id AS transaksi_id, dokter_id AS dokter_id, fee_dokter1 AS fee, tanggal_tindakan
        FROM transaksi_medis
        WHERE status_finalisasi = 'DONE_FINALISASI' AND dokter_id IS NOT NULL AND DATE(tanggal_tindakan) BETWEEN ? AND ?
        
        UNION ALL
        
        SELECT id AS transaksi_id, dokter2_id AS dokter_id, fee_dokter2 AS fee, tanggal_tindakan
        FROM transaksi_medis
        WHERE status_finalisasi = 'DONE_FINALISASI' AND dokter2_id IS NOT NULL AND DATE(tanggal_tindakan) BETWEEN ? AND ?
        
        UNION ALL
        
        SELECT 
          t.id AS transaksi_id, 
          d_anes.id AS dokter_id, 
          (t.biaya_anestesi / (SELECT COUNT(*) FROM master_dokter WHERE fokus = 'ANESTESI' OR tipe = 'DOKTER_ANESTESI')) AS fee, 
          t.tanggal_tindakan
        FROM transaksi_medis t
        JOIN master_dokter d_anes ON (d_anes.fokus = 'ANESTESI' OR d_anes.tipe = 'DOKTER_ANESTESI')
        WHERE t.status_finalisasi = 'DONE_FINALISASI' 
          AND t.biaya_anestesi > 0 
          AND DATE(t.tanggal_tindakan) BETWEEN ? AND ?
      ) rekap ON d.id = rekap.dokter_id
      GROUP BY d.id, d.nama, d.fokus
      ORDER BY total_fee DESC
    `;

    db.query(q, [tanggalMulai, tanggalSelesai, tanggalMulai, tanggalSelesai, tanggalMulai, tanggalSelesai], (err, laporans) => {
      if (err) return res.status(500).send("Database Error: " + err.message);
      res.render('laporan', { jenis, tanggalMulai, tanggalSelesai, laporans: laporans || [] });
    });

  } else {
    const q = `
      SELECT
        s.id,
        s.nama,
        s.peran,
        COUNT(rekap_suster.transaksi_id) AS total_tindakan,
        IFNULL(SUM(rekap_suster.fee), 0) AS total_fee
      FROM master_suster s
      LEFT JOIN (
        SELECT t.id AS transaksi_id, t.suster_op1_id AS suster_id, t.biaya_suster_op AS fee, t.tanggal_tindakan FROM transaksi_medis t WHERE t.status_finalisasi = 'DONE_FINALISASI' AND t.suster_op1_id IS NOT NULL
        UNION ALL
        SELECT t.id AS transaksi_id, t.suster_op2_id AS suster_id, t.biaya_suster_op AS fee, t.tanggal_tindakan FROM transaksi_medis t WHERE t.status_finalisasi = 'DONE_FINALISASI' AND t.suster_op2_id IS NOT NULL
        UNION ALL
        SELECT t.id AS transaksi_id, t.suster_op3_id AS suster_id, t.biaya_suster_op AS fee, t.tanggal_tindakan FROM transaksi_medis t WHERE t.status_finalisasi = 'DONE_FINALISASI' AND t.suster_op3_id IS NOT NULL

        UNION ALL

        SELECT 
          t.id AS transaksi_id, 
          s_jaga.id AS suster_id, 
          (t.biaya_suster_rawat / (SELECT COUNT(*) FROM master_suster WHERE peran = 'JAGA' OR peran LIKE '%Rawat%' OR peran LIKE '%Jaga%')) AS fee, 
          t.tanggal_tindakan
        FROM transaksi_medis t
        JOIN master_suster s_jaga ON (s_jaga.peran = 'JAGA' OR s_jaga.peran LIKE '%Rawat%' OR s_jaga.peran LIKE '%Jaga%')
        WHERE t.status_finalisasi = 'DONE_FINALISASI' 
          AND t.biaya_suster_rawat > 0
      ) rekap_suster ON s.id = rekap_suster.suster_id AND DATE(rekap_suster.tanggal_tindakan) BETWEEN ? AND ?
      GROUP BY s.id, s.nama, s.peran
      ORDER BY total_fee DESC
    `;

    db.query(q, [tanggalMulai, tanggalSelesai], (err, laporans) => {
      if (err) return res.status(500).send("Database Error: " + err.message);
      res.render('laporan', { jenis, tanggalMulai, tanggalSelesai, laporans: laporans || [] });
    });
  }
};

// 2. FUNGSI AJAX / API UNTUK MENGAMBIL RINCIAN TINDAKAN PETUGAS BERDASARKAN RENTANG TANGGAL
exports.getDetailRincian = (req, res) => {
  const { id, jenis, mulai, selesai } = req.query;

  if (!id || !mulai || !selesai) {
    return res.status(400).json({ error: "Parameter tidak lengkap" });
  }

  let q = "";
  if (jenis === 'dokter') {
    q = `
      SELECT t.tanggal_tindakan, t.nama_pasien, t.jenis_tindakan,
        CASE 
          WHEN t.dokter_id = ? THEN t.fee_dokter1
          WHEN t.dokter2_id = ? THEN t.fee_dokter2
          WHEN ? IN (SELECT id FROM master_dokter WHERE fokus = 'ANESTESI' OR tipe = 'DOKTER_ANESTESI') AND t.biaya_anestesi > 0 
            THEN (t.biaya_anestesi / (SELECT COUNT(*) FROM master_dokter WHERE fokus = 'ANESTESI' OR tipe = 'DOKTER_ANESTESI'))
          ELSE 0
        END AS fee_diterima
      FROM transaksi_medis t
      WHERE t.status_finalisasi = 'DONE_FINALISASI'
        AND DATE(t.tanggal_tindakan) BETWEEN ? AND ?
        AND (t.dokter_id = ? OR t.dokter2_id = ? OR (? IN (SELECT id FROM master_dokter WHERE fokus = 'ANESTESI' OR tipe = 'DOKTER_ANESTESI') AND t.biaya_anestesi > 0))
      ORDER BY t.tanggal_tindakan DESC
    `;
    db.query(q, [id, id, id, mulai, selesai, id, id, id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } else {
    q = `
      SELECT t.tanggal_tindakan, t.nama_pasien, t.jenis_tindakan,
        CASE 
          WHEN t.suster_op1_id = ? OR t.suster_op2_id = ? OR t.suster_op3_id = ? THEN t.biaya_suster_op
          WHEN ? IN (SELECT id FROM master_suster WHERE peran = 'JAGA' OR peran LIKE '%Rawat%' OR peran LIKE '%Jaga%') AND t.biaya_suster_rawat > 0 
            THEN (t.biaya_suster_rawat / (SELECT COUNT(*) FROM master_suster WHERE peran = 'JAGA' OR peran LIKE '%Rawat%' OR peran LIKE '%Jaga%'))
          ELSE 0
        END AS fee_diterima
      FROM transaksi_medis t
      WHERE t.status_finalisasi = 'DONE_FINALISASI'
        AND DATE(t.tanggal_tindakan) BETWEEN ? AND ?
        AND (t.suster_op1_id = ? OR t.suster_op2_id = ? OR t.suster_op3_id = ? OR (? IN (SELECT id FROM master_suster WHERE peran = 'JAGA' OR peran LIKE '%Rawat%' OR peran LIKE '%Jaga%') AND t.biaya_suster_rawat > 0))
      ORDER BY t.tanggal_tindakan DESC
    `;
    db.query(q, [id, id, id, id, mulai, selesai, id, id, id, id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }
};