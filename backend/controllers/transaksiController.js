const db = require('../config/db');

// TAMPILKAN RIWAYAT TRANSAKSI (Dengan Pagination 50 baris, Search, & Filter Tanggal)
exports.getRiwayatTransaksi = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50; // Batasan 50 baris per halaman
  const offset = (page - 1) * limit;

  const searchQuery = req.query.search || '';
  const searchLike = `%${searchQuery}%`;
  
  const tanggalMulai = req.query.tanggal_mulai || '';
  const tanggalSelesai = req.query.tanggal_selesai || '';

  // Kondisi filter tanggal tindakan
  let dateFilterSQL = '';
  let queryParamsCount = [searchLike, searchLike, searchLike];
  let queryParamsData = [searchLike, searchLike, searchLike];

  if (tanggalMulai && tanggalSelesai) {
    dateFilterSQL = ' AND t.tanggal_tindakan BETWEEN ? AND ? ';
    queryParamsCount.push(tanggalMulai, tanggalSelesai);
    queryParamsData.push(tanggalMulai, tanggalSelesai);
  } else if (tanggalMulai) {
    dateFilterSQL = ' AND t.tanggal_tindakan >= ? ';
    queryParamsCount.push(tanggalMulai);
    queryParamsData.push(tanggalMulai);
  } else if (tanggalSelesai) {
    dateFilterSQL = ' AND t.tanggal_tindakan <= ? ';
    queryParamsCount.push(tanggalSelesai);
    queryParamsData.push(tanggalSelesai);
  }

  queryParamsData.push(limit, offset);

  // Query Hitung Total Data Sesuai Filter & Pencarian
  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM transaksi_medis t
    LEFT JOIN master_dokter d1 ON t.dokter_id = d1.id
    WHERE t.status_finalisasi = 'DONE_FINALISASI'
      AND (t.nama_pasien LIKE ? OR t.no_ktp LIKE ? OR t.jenis_tindakan LIKE ?)
      ${dateFilterSQL}
  `;

  // Query Ambil Data Transaksi dengan Join Dokter & Suster
  const qTrans = `
    SELECT t.*, 
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
      AND (t.nama_pasien LIKE ? OR t.no_ktp LIKE ? OR t.jenis_tindakan LIKE ?)
      ${dateFilterSQL}
    ORDER BY t.tanggal_tindakan DESC, t.id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, queryParamsCount, (err, countResult) => {
    if (err) {
      console.error("Database Error (Count Riwayat):", err);
      return res.status(500).send("Database Error (Count): " + err.message);
    }

    const totalData = countResult[0].total;
    const totalPages = Math.ceil(totalData / limit) || 1;

    db.query(qTrans, queryParamsData, (err, transaksis) => {
      if (err) {
        console.error("Database Error (Data Riwayat):", err);
        return res.status(500).send("Database Error (Trans): " + err.message);
      }

      res.render('riwayat_transaksi', {
        transaksis: transaksis || [],
        currentPage: page,
        totalPages: totalPages,
        search: searchQuery,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai
      });
    });
  });
};