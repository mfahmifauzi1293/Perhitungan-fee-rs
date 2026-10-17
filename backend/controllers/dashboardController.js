const db = require('../config/db');

exports.getDashboard = (req, res) => {
  const currentYear = new Date().getFullYear();

  // 1. Query Total Transaksi per Bulan (Grafik)
  const queryChart = `
    SELECT MONTH(tanggal_tindakan) AS bulan, SUM(total_nett) AS total_transaksi
    FROM transaksi_medis
    WHERE status_finalisasi = 'DONE_FINALISASI' AND YEAR(tanggal_tindakan) = ?
    GROUP BY MONTH(tanggal_tindakan)
  `;

  // 2. Query Jadwal Pasien (Diurutkan dari jadwal terdekat)
  const queryJadwal = `
    SELECT tanggal_tindakan, nama_pasien, jenis_tindakan
    FROM transaksi_medis
    WHERE status_pembayaran IN ('SCHEDULED', 'DP_PAID', 'LUNAS')
      AND tanggal_tindakan >= CURDATE()
    ORDER BY tanggal_tindakan ASC
  `;

  // 3. Query Summary Ringkasan Tindakan Completed
  const querySummaryTindakan = `
    SELECT jenis_tindakan, COUNT(id) AS jumlah
    FROM transaksi_medis
    WHERE status_finalisasi = 'DONE_FINALISASI'
    GROUP BY jenis_tindakan
    ORDER BY jumlah DESC
  `;

  // Eksekusi Berantai Query Database
  db.query(queryChart, [currentYear], (err, resChart) => {
    if (err) console.error("Error Chart:", err);

    const bulanData = Array(12).fill(0);
    if (resChart && resChart.length > 0) {
      resChart.forEach(row => {
        bulanData[row.bulan - 1] = Number(row.total_transaksi || 0);
      });
    }

    db.query(queryJadwal, (err, resJadwal) => {
      if (err) console.error("Error Jadwal:", err);

      db.query(querySummaryTindakan, (err, resTindakan) => {
        if (err) console.error("Error Summary Tindakan:", err);

        res.render('dashboard', {
          chartData: bulanData,
          jadwalPasien: resJadwal || [],
          summaryTindakan: resTindakan || []
        });
      });
    });
  });
};