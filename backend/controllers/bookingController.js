const db = require('../config/db');

// 1. Menampilkan Halaman Booking & Daftar Transaksi
exports.getBooking = (req, res) => {
  const queryTrans = `
    SELECT 
      t.*, 
      d.nama AS nama_dokter
    FROM transaksi_medis t
    LEFT JOIN master_dokter d ON t.dokter_id = d.id
    ORDER BY t.id DESC
  `;
  const queryDokter = "SELECT * FROM master_dokter";
  const queryTindakan = "SELECT * FROM master_tindakan";

  db.query(queryTrans, (err, transaksis) => {
    if (err) return res.status(500).send("Database Error: " + err.message);

    db.query(queryDokter, (err, dokters) => {
      if (err) return res.status(500).send("Database Error: " + err.message);

      db.query(queryTindakan, (err, tindakans) => {
        if (err) return res.status(500).send("Database Error: " + err.message);

        res.render('booking', {
          transaksis: transaksis || [],
          dokters: dokters || [],
          tindakans: tindakans || []
        });
      });
    });
  });
};

// 2. Menyimpan Data Booking Baru
exports.simpanBooking = (req, res) => {
  const { 
    nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan, 
    jenis_tindakan, dokter_id, harga_bruto, diskon, dp 
  } = req.body;

  const harga = parseFloat(harga_bruto) || 0;
  const disc = parseFloat(diskon) || 0;
  const down_payment = parseFloat(dp) || 0;
  const total_nett = harga - disc;
  const sisa_bayar = Math.max(0, total_nett - down_payment);

  // Tentukan status pembayaran & finalisasi awal
  const status_pembayaran = sisa_bayar <= 0 ? 'LUNAS' : 'DP_PAID';
  const status_finalisasi = sisa_bayar <= 0 ? 'SIAP_FINALISASI' : 'BELUM_LUNAS';

  const query = `
    INSERT INTO transaksi_medis 
    (nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan, jenis_tindakan, dokter_id, total_harga, diskon, total_nett, dp, sisa_bayar, status_pembayaran, status_finalisasi) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query, 
    [
      nama_pasien, alamat_pasien, tanggal_booking, tanggal_tindakan, 
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

// 3. Memproses Pelunasan Transaksi
exports.prosesPelunasan = (req, res) => {
  const { transaksi_id, nominal_bayar } = req.body;

  db.query('SELECT total_nett, dp, pelunasan FROM transaksi_medis WHERE id = ?', [transaksi_id], (err, rows) => {
    if (err || !rows || rows.length === 0) {
      console.error("Error Query Transaksi Pelunasan:", err);
      return res.status(500).send("Transaksi tidak ditemukan.");
    }

    const totalNett = Number(rows[0].total_nett || 0);
    const dpAwal = Number(rows[0].dp || 0);
    const pelunasanLama = Number(rows[0].pelunasan || 0);
    const nominalBaru = Number(nominal_bayar || 0);

    const totalPelunasanBaru = pelunasanLama + nominalBaru;
    const sisaBayar = Math.max(0, totalNett - (dpAwal + totalPelunasanBaru));

    // Update status pembayaran & status finalisasi
    const newStatusBayar = sisaBayar <= 0 ? 'LUNAS' : 'DP_PAID';
    const newStatusFinalisasi = sisaBayar <= 0 ? 'SIAP_FINALISASI' : 'BELUM_LUNAS';

    const qUpdate = `
      UPDATE transaksi_medis 
      SET pelunasan = ?, sisa_bayar = ?, status_pembayaran = ?, status_finalisasi = ?
      WHERE id = ?
    `;

    db.query(qUpdate, [totalPelunasanBaru, sisaBayar, newStatusBayar, newStatusFinalisasi, transaksi_id], (updateErr) => {
      if (updateErr) {
        console.error("Error Update Pelunasan:", updateErr);
        return res.status(500).send("Gagal memproses pelunasan.");
      }
      res.redirect('/booking');
    });
  });
};

// 4. Menampilkan Invoice Transaksi
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
    if (err) return res.status(500).send("Terjadi kesalahan pada database: " + err.message);
    if (results.length === 0) return res.status(404).send("Data Invoice tidak ditemukan.");

    res.render('invoice', { invoice: results[0] });
  });
};

// 5. Memproses Cancel/Refund Booking
exports.refundBooking = (req, res) => {
  const id = req.params.id;
  const { nominal_refund, alasan_refund } = req.body;

  const nominal = Number(nominal_refund) || 0;
  const alasan = alasan_refund || '';

  const query = `
    UPDATE transaksi_medis 
    SET status_pembayaran = 'CANCELLED', 
        sisa_bayar = 0,
        nominal_refund = ?,
        alasan_refund = ?
    WHERE id = ?
  `;

  db.query(query, [nominal, alasan, id], (err) => {
    if (err) return res.status(500).send("Gagal melakukan refund.");
    res.redirect('/booking');
  });
};