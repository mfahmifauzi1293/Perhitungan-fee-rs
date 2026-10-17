const db = require('../config/db');

// Render Halaman Fasilitas dengan Data Tindakan & Dokter untuk Modal Booking
exports.getFasilitas = (req, res) => {
  const queryTindakan = "SELECT id, nama_tindakan, kategori FROM master_tindakan ORDER BY nama_tindakan ASC";
  const queryDokter = "SELECT id, nama, fokus AS spesialis, fokus, jadwal FROM master_dokter ORDER BY nama ASC";

  db.query(queryTindakan, (err, tindakans) => {
    if (err) {
      console.error("Error Query Tindakan Fasilitas:", err);
    }

    db.query(queryDokter, (errDokter, dokters) => {
      if (errDokter) {
        console.error("Error Query Dokter Fasilitas:", errDokter);
      }

      res.render('fasilitas', {
        user: req.session.user || null,
        layanan: tindakans || [],
        dokters: dokters || []
      });
    });
  });
};