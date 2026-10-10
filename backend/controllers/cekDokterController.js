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

    res.render('cekdokter', {
      dokterList: formattedDokterList,
      selectedSpesialis: spesialis || 'all'
    });
  });
};