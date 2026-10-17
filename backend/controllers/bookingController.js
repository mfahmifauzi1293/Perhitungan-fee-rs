const db = require('../config/db');

// 1. Menampilkan Halaman Booking & Daftar Transaksi dengan Filter, Search, & Limit 50 per halaman
exports.getBooking = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 25; // Batasan 25 baris per halaman
  const offset = (page - 1) * limit;

  const searchQuery = req.query.search || '';
  const searchLike = `%${searchQuery}%`;
  
  const tanggalMulai = req.query.tanggal_mulai || '';
  const tanggalSelesai = req.query.tanggal_selesai || '';

  // Buat kondisi filter dinamis untuk tanggal tindakan
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

  // Hitung total data sesuai filter & search
  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM transaksi_medis t
    LEFT JOIN master_dokter d ON t.dokter_id = d.id
    WHERE (t.nama_pasien LIKE ? OR t.no_ktp LIKE ? OR t.jenis_tindakan LIKE ?)
    ${dateFilterSQL}
  `;

  // Ambil data transaksi dengan LIMIT 50 dan OFFSET
  const queryTrans = `
    SELECT
      t.*,
      d.nama AS nama_dokter
    FROM transaksi_medis t
    LEFT JOIN master_dokter d ON t.dokter_id = d.id
    WHERE (t.nama_pasien LIKE ? OR t.no_ktp LIKE ? OR t.jenis_tindakan LIKE ?)
    ${dateFilterSQL}
    ORDER BY t.id DESC
    LIMIT ? OFFSET ?
  `;

  const queryDokter = "SELECT * FROM master_dokter";
  const queryTindakan = "SELECT * FROM master_tindakan";

  db.query(countQuery, queryParamsCount, (err, countResult) => {
    if (err) return res.status(500).send("Database Error: " + err.message);

    const totalData = countResult[0].total;
    const totalPages = Math.ceil(totalData / limit) || 1;

    db.query(queryTrans, queryParamsData, (err, transaksis) => {
      if (err) return res.status(500).send("Database Error: " + err.message);

      db.query(queryDokter, (err, dokters) => {
        if (err) return res.status(500).send("Database Error: " + err.message);

        db.query(queryTindakan, (err, tindakans) => {
          if (err) return res.status(500).send("Database Error: " + err.message);

          res.render('booking', {
            transaksis: transaksis || [],
            dokters: dokters || [],
            tindakans: tindakans || [],
            currentPage: page,
            totalPages: totalPages,
            search: searchQuery,
            tanggal_mulai: tanggalMulai,
            tanggal_selesai: tanggalSelesai
          });
        });
      });
    });
  });
};

// 2. Menyimpan Data Booking Baru
exports.simpanBooking = (req, res) => {
  const {
    no_ktp, nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan,
    jenis_tindakan, dokter_id, harga_bruto, diskon, dp
  } = req.body;

  const harga = parseFloat(harga_bruto) || 0;
  const disc = parseFloat(diskon) || 0;
  const down_payment = parseFloat(dp) || 0;
  const total_nett = harga - disc;
  const sisa_bayar = Math.max(0, total_nett - down_payment);

  const status_pembayaran = sisa_bayar <= 0 ? 'LUNAS' : 'DP_PAID';
  const status_finalisasi = sisa_bayar <= 0 ? 'SIAP_FINALISASI' : 'BELUM_LUNAS';

  const query = `
    INSERT INTO transaksi_medis
    (no_ktp, nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan, jenis_tindakan, dokter_id, total_harga, diskon, total_nett, dp, sisa_bayar, status_pembayaran, status_finalisasi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      no_ktp || '', nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan,
      jenis_tindakan, dokter_id || null, harga, disc, total_nett,
      down_payment, sisa_bayar, status_pembayaran, status_finalisasi
    ],
    (err) => {
      if (err) {
        console.error("Error Simpan Booking:", err);
        return res.status(500).send("Gagal menyimpan data booking.");
      }
      res.redirect('/booking');
    }
  );
};

// 3. Memproses Edit / Perbarui Data Booking
exports.editBooking = (req, res) => {
  const id = req.params.id;
  const {
    no_ktp, nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan,
    jenis_tindakan, dokter_id, harga_bruto, diskon, dp
  } = req.body;

  const harga = parseFloat(harga_bruto) || 0;
  const disc = parseFloat(diskon) || 0;
  const down_payment = parseFloat(dp) || 0;
  const total_nett = harga - disc;

  db.query('SELECT pelunasan FROM transaksi_medis WHERE id = ?', [id], (err, rows) => {
    if (err || !rows || rows.length === 0) {
      return res.status(500).send("Data booking tidak ditemukan.");
    }

    const pelunasanSudahAda = Number(rows[0].pelunasan || 0);
    const sisa_bayar = Math.max(0, total_nett - (down_payment + pelunasanSudahAda));

    const status_pembayaran = sisa_bayar <= 0 ? 'LUNAS' : 'DP_PAID';
    const status_finalisasi = sisa_bayar <= 0 ? 'SIAP_FINALISASI' : 'BELUM_LUNAS';

    const query = `
      UPDATE transaksi_medis
      SET no_ktp = ?, nama_pasien = ?, alamat_pasien = ?, tanggal_booking = ?, tanggal_tindakan = ?, 
          jenis_tindakan = ?, dokter_id = ?, total_harga = ?, diskon = ?, total_nett = ?, 
          dp = ?, sisa_bayar = ?, status_pembayaran = ?, status_finalisasi = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [
        no_ktp || '', nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan,
        jenis_tindakan, dokter_id || null, harga, disc, total_nett,
        down_payment, sisa_bayar, status_pembayaran, status_finalisasi, id
      ],
      (updateErr) => {
        if (updateErr) {
          console.error("Error Edit Booking:", updateErr);
          return res.status(500).send("Gagal memperbarui data booking.");
        }
        res.redirect('/booking');
      }
    );
  });
};

// 4. Memproses Pelunasan Transaksi
exports.prosesPelunasan = (req, res) => {
  const { transaksi_id, nominal_bayar } = req.body;

  db.query('SELECT total_nett, dp, pelunasan FROM transaksi_medis WHERE id = ?', [transaksi_id], (err, rows) => {
    if (err || !rows || rows.length === 0) {
      return res.status(500).send("Transaksi tidak ditemukan.");
    }

    const totalNett = Number(rows[0].total_nett || 0);
    const dpAwal = Number(rows[0].dp || 0);
    const pelunasanLama = Number(rows[0].pelunasan || 0);
    const nominalBaru = Number(nominal_bayar || 0);

    const totalPelunasanBaru = pelunasanLama + nominalBaru;
    const sisaBayar = Math.max(0, totalNett - (dpAwal + totalPelunasanBaru));

    const newStatusBayar = sisaBayar <= 0 ? 'LUNAS' : 'DP_PAID';
    const newStatusFinalisasi = sisaBayar <= 0 ? 'SIAP_FINALISASI' : 'BELUM_LUNAS';

    const qUpdate = `
      UPDATE transaksi_medis
      SET pelunasan = ?, sisa_bayar = ?, status_pembayaran = ?, status_finalisasi = ?
      WHERE id = ?
    `;

    db.query(qUpdate, [totalPelunasanBaru, sisaBayar, newStatusBayar, newStatusFinalisasi, transaksi_id], (updateErr) => {
      if (updateErr) return res.status(500).send("Gagal memproses pelunasan.");
      res.redirect('/booking');
    });
  });
};

// 5. Menampilkan Invoice Transaksi
exports.getInvoice = (req, res) => {
  const transaksiId = req.params.id;
  if (!transaksiId) return res.status(400).send("ID Transaksi tidak valid.");

  const query = `
    SELECT t.*, d.nama AS nama_dokter
    FROM transaksi_medis t
    LEFT JOIN master_dokter d ON t.dokter_id = d.id
    WHERE t.id = ?
  `;

  db.query(query, [transaksiId], (err, results) => {
    if (err) return res.status(500).send("Database Error: " + err.message);
    if (results.length === 0) return res.status(404).send("Data Invoice tidak ditemukan.");
    res.render('invoice', { invoice: results[0] });
  });
};

// 6. Memproses Cancel/Refund Booking (Dengan DP)
exports.refundBooking = (req, res) => {
  const id = req.params.id;
  const { nominal_refund, alasan_refund } = req.body;

  const query = `
    UPDATE transaksi_medis
    SET status_pembayaran = 'CANCELLED', sisa_bayar = 0, nominal_refund = ?, alasan_refund = ?
    WHERE id = ?
  `;

  db.query(query, [Number(nominal_refund) || 0, alasan_refund || '', id], (err) => {
    if (err) return res.status(500).send("Gagal melakukan refund.");
    res.redirect('/booking');
  });
};

// 7. Memproses Cancel Booking Tanpa Refund (DP = 0)
exports.cancelBooking = (req, res) => {
  const id = req.params.id;

  const query = `
    UPDATE transaksi_medis
    SET status_pembayaran = 'CANCELLED', sisa_bayar = 0
    WHERE id = ?
  `;

  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error Cancel Booking:", err);
      return res.status(500).send("Gagal membatalkan booking.");
    }
    res.redirect('/booking');
  });
};