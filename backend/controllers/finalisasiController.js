const db = require('../config/db');

// 1. TAMPILKAN HALAMAN FINALISASI & ANTREAN PASIEN
exports.getFinalisasi = (req, res) => {
  const qTrans = `
    SELECT t.*, d.nama AS nama_dokter1 
    FROM transaksi_medis t
    LEFT JOIN master_dokter d ON t.dokter_id = d.id
    WHERE t.status_finalisasi IN ('BELUM_LUNAS', 'SIAP_FINALISASI', 'DONE_FINALISASI')
    ORDER BY t.tanggal_tindakan DESC, t.id DESC
  `;
  const qDokter = "SELECT * FROM master_dokter";
  const qSuster = "SELECT * FROM master_suster";

  db.query(qTrans, (err, transaksis) => {
    if (err) return res.status(500).send("Database Error (Trans): " + err.message);
    
    db.query(qDokter, (err, dokters) => {
      if (err) return res.status(500).send("Database Error (Dokter): " + err.message);
      
      db.query(qSuster, (err, susters) => {
        if (err) return res.status(500).send("Database Error (Suster): " + err.message);
        
        res.render('finalisasi', { 
          transaksis: transaksis || [], 
          dokters: dokters || [], 
          susters: susters || [] 
        });
      });
    });
  });
};

// 2. PROSES / SIMPAN FINALISASI TRANSAKSI
exports.prosesFinalisasi = (req, res) => {
  const id = req.params.id;

  const {
    dokter_id, 
    persen_dokter1, 
    dokter2_id, 
    persen_dokter2,
    dokter_anestesi_id, 
    tipe_anestesi, 
    biaya_anestesi,
    durasi_ok, 
    tarif_ok_per_jam, 
    biaya_ruang_operasi,
    biaya_obat, 
    biaya_suster_op, 
    biaya_suster_rawat,
    suster_op1_id, 
    suster_op2_id, 
    suster_op3_id, 
    suster_rawat_id
  } = req.body;

  db.query("SELECT total_nett FROM transaksi_medis WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send("Data transaksi tidak ditemukan.");
    }

    const totalNett = parseFloat(results[0].total_nett) || 0;

    // Parse Biaya Ruang Operasi OK
    const durasiOK = parseFloat(durasi_ok) || 0;
    const tarifOK = parseFloat(tarif_ok_per_jam) || 0;
    const bOK = parseFloat(biaya_ruang_operasi) || (durasiOK * tarifOK);

    // Parse Biaya Operasional Lainnya
    const bAnestesi = parseFloat(biaya_anestesi) || 0;
    const bObat = parseFloat(biaya_obat) || 0;
    const bSusterOp = parseFloat(biaya_suster_op) || 0;
    const bSusterRawat = parseFloat(biaya_suster_rawat) || 0;

    // Total Potongan & Sisa Bersih
    const totalPotongan = bAnestesi + bOK + bSusterOp + bSusterRawat + bObat;
    const sisaBersih = Math.max(0, totalNett - totalPotongan);

    // Pembagian 30% RS dan 70% Dokter
    const bagianRS = sisaBersih * 0.30;
    const totalBagianDokter = sisaBersih * 0.70;

    // Pembagian Fee Dokter 1 & Dokter 2
    let p1 = parseFloat(persen_dokter1);
    let p2 = parseFloat(persen_dokter2);

    if (isNaN(p1)) p1 = dokter2_id ? 70 : 100;
    if (isNaN(p2)) p2 = dokter2_id ? 30 : 0;

    const feeDokter1 = totalBagianDokter * (p1 / 100);
    const feeDokter2 = totalBagianDokter * (p2 / 100);

    // Update ke Database (TANPA bagian_dokter_70)
    const qUpdate = `
      UPDATE transaksi_medis SET 
        dokter_id = ?, 
        persen_dokter1 = ?, 
        fee_dokter1 = ?,
        dokter2_id = ?, 
        persen_dokter2 = ?, 
        fee_dokter2 = ?,
        dokter_anestesi_id = ?, 
        tipe_anestesi = ?, 
        biaya_anestesi = ?,
        durasi_ok = ?, 
        tarif_ok_per_jam = ?, 
        biaya_ruang_operasi = ?,
        suster_op1_id = ?, 
        suster_op2_id = ?, 
        suster_op3_id = ?, 
        biaya_suster_op = ?,
        suster_rawat_id = ?, 
        biaya_suster_rawat = ?, 
        biaya_obat = ?,
        sisa_pembagian = ?, 
        bagian_rs_30 = ?,
        status_finalisasi = 'DONE_FINALISASI'
      WHERE id = ?
    `;

    const values = [
      dokter_id || null, 
      p1, 
      feeDokter1,
      dokter2_id || null, 
      p2, 
      feeDokter2,
      dokter_anestesi_id || null, 
      tipe_anestesi || null, 
      bAnestesi,
      durasiOK, 
      tarifOK, 
      bOK,
      suster_op1_id || null, 
      suster_op2_id || null, 
      suster_op3_id || null, 
      bSusterOp,
      suster_rawat_id || null, 
      bSusterRawat, 
      bObat,
      sisaBersih, 
      bagianRS, 
      id
    ];

    db.query(qUpdate, values, (err) => {
      if (err) {
        console.error("Gagal Finalisasi Transaksi:", err);
        return res.status(500).send("Gagal memproses finalisasi: " + err.message);
      }
      res.redirect('/finalisasi');
    });
  });
};