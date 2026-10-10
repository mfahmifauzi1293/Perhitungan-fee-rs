const db = require('../config/db'); // Sesuaikan path file koneksi database Anda

exports.getLayanan = async (req, res) => {
  try {
    const { kategori } = req.params;
    
    let query = 'SELECT * FROM master_tindakan';
    let queryParams = [];

    if (kategori && kategori !== 'semua') {
      query += ' WHERE LOWER(kategori) LIKE ?';
      queryParams.push(`%${kategori.toLowerCase()}%`);
    }

    query += ' ORDER BY kategori ASC, nama_tindakan ASC';

    // Mendukung mysql2/promise maupun callback biasa
    if (typeof db.query === 'function') {
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error('❌ Database Query Error:', err);
          return res.status(500).send(`Database Error: ${err.message}`);
        }
        res.render('layanan', {
          layanan: results || [],
          selectedKategori: kategori || 'semua'
        });
      });
    } else {
      const [results] = await db.query(query, queryParams);
      res.render('layanan', {
        layanan: results || [],
        selectedKategori: kategori || 'semua'
      });
    }
  } catch (err) {
    console.error('❌ Controller Error Detail:', err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};