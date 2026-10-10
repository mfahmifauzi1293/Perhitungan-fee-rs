const db = require('../config/db');

exports.getDashboard = (req, res) => {
  const currentYear = new Date().getFullYear();

  // 1. Query Pendapatan RS per Bulan
  const queryChart = `
    SELECT MONTH(tanggal_tindakan) AS bulan, SUM(bagian_rs_30) AS total_rs 
    FROM transaksi_medis 
    WHERE status_finalisasi = 'DONE_FINALISASI' AND YEAR(tanggal_tindakan) = ? 
    GROUP BY MONTH(tanggal_tindakan)
  `;

  // 2. Query Jadwal Pasien
  const queryJadwal = `
    SELECT tanggal_tindakan, nama_pasien, jenis_tindakan 
    FROM transaksi_medis 
    WHERE status_pembayaran IN ('SCHEDULED', 'DP_PAID', 'LUNAS') 
    ORDER BY tanggal_tindakan ASC 
    LIMIT 10
  `;

  // 3. Query Summary Ringkasan Tindakan
  const querySummaryTindakan = `
    SELECT jenis_tindakan, COUNT(id) AS jumlah 
    FROM transaksi_medis 
    WHERE status_finalisasi = 'DONE_FINALISASI' 
    GROUP BY jenis_tindakan 
    ORDER BY jumlah DESC
  `;

  // 4. Query Summary Fee Dokter (Gabungan Dokter 1 & Dokter 2)
  const querySummaryDokter = `
    SELECT 
      d.nama AS nama_dokter, 
      COUNT(rekap.transaksi_id) AS total_ops, 
      SUM(rekap.fee) AS total_fee 
    FROM (
      -- Ambil Transaksi & Fee sebagai Dokter 1
      SELECT id AS transaksi_id, dokter_id AS dokter_id, fee_dokter1 AS fee 
      FROM transaksi_medis 
      WHERE status_finalisasi = 'DONE_FINALISASI' AND dokter_id IS NOT NULL

      UNION ALL

      -- Ambil Transaksi & Fee sebagai Dokter 2
      SELECT id AS transaksi_id, dokter2_id AS dokter_id, fee_dokter2 AS fee 
      FROM transaksi_medis 
      WHERE status_finalisasi = 'DONE_FINALISASI' AND dokter2_id IS NOT NULL
    ) rekap
    JOIN master_dokter d ON rekap.dokter_id = d.id
    GROUP BY d.id, d.nama
    ORDER BY total_fee DESC
  `;

  // Eksekusi Berantai Query Database
  db.query(queryChart, [currentYear], (err, resChart) => {
    if (err) console.error("Error Chart:", err);

    const bulanData = Array(12).fill(0);
    if (resChart && resChart.length > 0) {
      resChart.forEach(row => {
        bulanData[row.bulan - 1] = Number(row.total_rs || 0);
      });
    }

    db.query(queryJadwal, (err, resJadwal) => {
      if (err) console.error("Error Jadwal:", err);

      db.query(querySummaryTindakan, (err, resTindakan) => {
        if (err) console.error("Error Summary Tindakan:", err);

        db.query(querySummaryDokter, (err, resDokter) => {
          if (err) console.error("Error Summary Dokter:", err);

          res.render('dashboard', {
            chartData: bulanData,
            jadwalPasien: resJadwal || [],
            summaryTindakan: resTindakan || [],
            summaryDokter: resDokter || []
          });
        });
      });
    });
  });
};