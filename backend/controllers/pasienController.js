const db = require('../config/db');

// TAMPILKAN RIWAYAT PASIEN (Dengan Pagination 50 baris, Search, & Filter Tanggal)
exports.getRiwayatPasien = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50; // Batasan 50 baris per halaman
  const offset = (page - 1) * limit;

  const searchQuery = req.query.search || '';
  const searchLike = `%${searchQuery}%`;
  
  const tanggalMulai = req.query.tanggal_mulai || '';
  const tanggalSelesai = req.query.tanggal_selesai || '';

  // Kondisi filter tanggal kunjungan terakhir (atau berdasarkan tanggal tindakan)
  let dateFilterSQL = '';
  let queryParamsCount = [searchLike, searchLike, searchLike];
  let queryParamsData = [searchLike, searchLike, searchLike];

  if (tanggalMulai && tanggalSelesai) {
    dateFilterSQL = ' AND MAX(t.tanggal_tindakan) BETWEEN ? AND ? ';
    // Karena menggunakan HAVING / WHERE pada GROUP BY, kita sesuaikan nanti di query
  } else if (tanggalMulai) {
    dateFilterSQL = ' AND MAX(t.tanggal_tindakan) >= ? ';
  } else if (tanggalSelesai) {
    dateFilterSQL = ' AND MAX(t.tanggal_tindakan) <= ? ';
  }

  // Query Hitung Total Data Pasien (Unik Berdasarkan No. KTP atau Nama) dengan Filter
  const countQuery = `
    SELECT COUNT(*) AS total FROM (
      SELECT no_ktp, nama_pasien
      FROM transaksi_medis
      WHERE (nama_pasien LIKE ? OR no_ktp LIKE ? OR alamat_pasien LIKE ?)
      GROUP BY no_ktp, nama_pasien
      ${tanggalMulai || tanggalSelesai ? 'HAVING ' + dateFilterSQL.trim().replace(/^AND\s+/i, '') : ''}
    ) AS subquery
  `;

  if (tanggalMulai && tanggalSelesai) {
    queryParamsCount.push(tanggalMulai, tanggalSelesai);
  } else if (tanggalMulai) {
    queryParamsCount.push(tanggalMulai);
  } else if (tanggalSelesai) {
    queryParamsCount.push(tanggalSelesai);
  }

  // Query Utama Data Pasien
  let qPasien = `
    SELECT 
      no_ktp,
      nama_pasien,
      MAX(alamat_pasien) AS alamat_pasien,
      COUNT(id) AS total_kunjungan,
      MAX(tanggal_tindakan) AS kunjungan_terakhir,
      SUM(total_nett) AS total_pengeluaran
    FROM transaksi_medis
    WHERE (nama_pasien LIKE ? OR no_ktp LIKE ? OR alamat_pasien LIKE ?)
    GROUP BY no_ktp, nama_pasien
  `;

  if (tanggalMulai && tanggalSelesai) {
    qPasien += ` HAVING MAX(tanggal_tindakan) BETWEEN ? AND ? `;
    queryParamsData.push(tanggalMulai, tanggalSelesai);
  } else if (tanggalMulai) {
    qPasien += ` HAVING MAX(tanggal_tindakan) >= ? `;
    queryParamsData.push(tanggalMulai);
  } else if (tanggalSelesai) {
    qPasien += ` HAVING MAX(tanggal_tindakan) <= ? `;
    queryParamsData.push(tanggalSelesai);
  }

  qPasien += ` ORDER BY kunjungan_terakhir DESC LIMIT ? OFFSET ? `;
  queryParamsData.push(limit, offset);

  db.query(countQuery, queryParamsCount, (err, countResult) => {
    if (err) {
      console.error("Database Error (Count Riwayat Pasien):", err);
      return res.status(500).send("Database Error (Count): " + err.message);
    }

    const totalData = countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalData / limit) || 1;

    db.query(qPasien, queryParamsData, (err, pasiens) => {
      if (err) {
        console.error("Database Error (Data Riwayat Pasien):", err);
        return res.status(500).send("Database Error (Pasien): " + err.message);
      }

      res.render('riwayat_pasien', {
        pasiens: pasiens || [],
        currentPage: page,
        totalPages: totalPages,
        search: searchQuery,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai
      });
    });
  });
};

// TAMPILKAN DETAIL HISTORI MEDIS PASIEN
exports.getRiwayatPasienDetail = (req, res) => {
  const noKtp = req.query.no_ktp;
  if (!noKtp) return res.status(400).send("No KTP pasien tidak valid.");

  const queryDetail = `
    SELECT t.*, d.nama AS nama_dokter1
    FROM transaksi_medis t
    LEFT JOIN master_dokter d ON t.dokter_id = d.id
    WHERE TRIM(t.no_ktp) = TRIM(?)
    ORDER BY t.tanggal_tindakan DESC, t.id DESC
  `;

  db.query(queryDetail, [noKtp], (err, rows) => {
    if (err) {
      console.error("Database Error (Detail Riwayat Pasien):", err);
      return res.status(500).send("Database Error: " + err.message);
    }
    
    res.render('riwayat_pasien_detail', {
      transaksis: rows || [], // Sesuai dengan yang dibaca riwayat_pasien_detail.ejs
      noKtp: noKtp,
      namaPasien: rows.length > 0 ? rows[0].nama_pasien : '-'
    });
  });
};