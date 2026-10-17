const db = require('../config/db');

exports.getCekDokter = (req, res) => {
  const { spesialis } = req.query;
  let query = 'SELECT * FROM master_dokter';
  let params = [];

  if (spesialis && spesialis !== 'all') {
    query += ' WHERE LOWER(fokus) LIKE ?';
    params.push(`%${spesialis.toLowerCase()}%`);
  }
  query += ' ORDER BY nama ASC';

  // Query tambahan untuk mengambil data seluruh tindakan (diperlukan oleh onlinebooking.ejs)
  const queryTindakan = 'SELECT id, nama_tindakan, kategori FROM master_tindakan ORDER BY nama_tindakan ASC';
  // Query untuk memastikan daftar lengkap dokter untuk dropdown modal booking
  const queryAllDokter = 'SELECT id, nama, fokus AS spesialis, fokus, jadwal FROM master_dokter ORDER BY nama ASC';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching dokter:', err);
      return res.status(500).send(`Database Error: ${err.message}`);
    }

    const formattedDokterList = (results || []).map(row => ({
      ...row,
      nama_dokter: row.nama || 'Dokter Spesialis',
      spesialis: row.fokus || row.tipe || 'Spesialis',
      jadwal_praktek: row.jadwal || 'Hubungi Admin untuk Jadwal',
      deskripsi: row.deskripsi || 'Dokter spesialis berpengalaman di RS Sakti Mandra Guna.',
      foto: row.foto || '/image/default-doctor.png'
    }));

    // Ambil data tindakan dan seluruh dokter untuk modal booking online
    db.query(queryTindakan, (errTindakan, tindakans) => {
      db.query(queryAllDokter, (errAllDokter, allDokters) => {
        res.render('cekdokter', {
          dokterList: formattedDokterList,
          dokters: allDokters || [],
          layanan: tindakans || [],
          tindakans: tindakans || [],
          selectedSpesialis: spesialis || 'all',
          user: req.session.user || null
        });
      });
    });
  });
};