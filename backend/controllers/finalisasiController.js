const db = require('../config/db');

// 1. TAMPILKAN HALAMAN FINALISASI & ANTREAN PASIEN (Dengan Pagination 50 baris, Search, & Filter Tanggal)
exports.getFinalisasi = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50; // Batasan 50 baris per halaman
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
    WHERE t.status_finalisasi IN ('BELUM_LUNAS', 'SIAP_FINALISASI', 'DONE_FINALISASI')
      AND (t.nama_pasien LIKE ? OR t.no_ktp LIKE ? OR t.jenis_tindakan LIKE ?)
      ${dateFilterSQL}
  `;

  const qTrans = `
    SELECT t.*, d.nama AS nama_dokter1
    FROM transaksi_medis t
    LEFT JOIN master_dokter d ON t.dokter_id = d.id
    WHERE t.status_finalisasi IN ('BELUM_LUNAS', 'SIAP_FINALISASI', 'DONE_FINALISASI')
      AND (t.nama_pasien LIKE ? OR t.no_ktp LIKE ? OR t.jenis_tindakan LIKE ?)
      ${dateFilterSQL}
    ORDER BY t.tanggal_tindakan DESC, t.id DESC
    LIMIT ? OFFSET ?
  `;

  const qDokter = "SELECT * FROM master_dokter";
  const qSuster = "SELECT * FROM master_suster";

  db.query(countQuery, queryParamsCount, (err, countResult) => {
    if (err) return res.status(500).send("Database Error (Count): " + err.message);

    const totalData = countResult[0].total;
    const totalPages = Math.ceil(totalData / limit) || 1;

    db.query(qTrans, queryParamsData, (err, transaksis) => {
      if (err) return res.status(500).send("Database Error (Trans): " + err.message);
     
      db.query(qDokter, (err, dokters) => {
        if (err) return res.status(500).send("Database Error (Dokter): " + err.message);
       
        db.query(qSuster, (err, susters) => {
          if (err) return res.status(500).send("Database Error (Suster): " + err.message);
         
          res.render('finalisasi', {
            transaksis: transaksis || [],
            dokters: dokters || [],
            susters: susters || [],
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

// 2. PROSES / SIMPAN FINALISASI TRANSAKSI + GENERATE DETAIL FEE
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

  db.query('SELECT * FROM transaksi_medis WHERE id = ?', [id], (err, rows) => {
    if (err || !rows || rows.length === 0) {
      return res.status(500).send("Data transaksi tidak ditemukan.");
    }

    const tx = rows[0];
    const totalNett = Number(tx.total_nett || 0);
    const tanggalTindakan = tx.tanggal_tindakan;

    const bAnestesi = parseFloat(biaya_anestesi) || 0;
    const bOp = parseFloat(biaya_ruang_operasi) || 0;
    const bObat = parseFloat(biaya_obat) || 0;
    const bSusterOp = parseFloat(biaya_suster_op) || 0;
    const bSusterRawat = parseFloat(biaya_suster_rawat) || 0;

    // Sisa untuk pembagian fee dokter & RS
    const sisaFee = totalNett - (bAnestesi + bOp + bObat + bSusterOp + bSusterRawat);
    const bagianRs30 = sisaFee * 0.30;
    const bagianDokter70 = sisaFee * 0.70;

    const pDok1 = parseFloat(persen_dokter1) || 100;
    const pDok2 = parseFloat(persen_dokter2) || 0;
    const totalPersen = pDok1 + pDok2 > 0 ? pDok1 + pDok2 : 100;

    const feeDokter1 = (bagianDokter70 * pDok1) / totalPersen;
    const feeDokter2 = dokter2_id ? (bagianDokter70 * pDok2) / totalPersen : 0;

    const qUpdate = `
      UPDATE transaksi_medis SET
        dokter_id = ?, persen_dokter1 = ?, dokter2_id = ?, persen_dokter2 = ?,
        dokter_anestesi_id = ?, tipe_anestesi = ?, biaya_anestesi = ?,
        durasi_ok = ?, tarif_ok_per_jam = ?, biaya_ruang_operasi = ?,
        biaya_obat = ?, biaya_suster_op = ?, biaya_suster_rawat = ?,
        suster_op1_id = ?, suster_op2_id = ?, suster_op3_id = ?, suster_rawat_id = ?,
        bagian_rs_30 = ?, bagian_dokter_70 = ?, fee_dokter1 = ?, fee_dokter2 = ?,
        status_finalisasi = 'DONE_FINALISASI'
      WHERE id = ?
    `;

    db.query(qUpdate, [
      dokter_id || null, pDok1, dokter2_id || null, pDok2,
      dokter_anestesi_id || null, tipe_anestesi || '', bAnestesi,
      parseFloat(durasi_ok) || 0, parseFloat(tarif_ok_per_jam) || 0, bOp,
      bObat, bSusterOp, bSusterRawat,
      suster_op1_id || null, suster_op2_id || null, suster_op3_id || null, suster_rawat_id || null,
      bagianRs30, bagianDokter70, feeDokter1, feeDokter2, id
    ], (updateErr) => {
      if (updateErr) {
        console.error("Error Proses Finalisasi:", updateErr);
        return res.status(500).send("Gagal memproses finalisasi transaksi.");
      }

      // === OTOMATIS CATAT DETAIL FEE KE TABEL transaksi_fee_detail ===
      db.query(`DELETE FROM transaksi_fee_detail WHERE transaksi_id = ?`, [id], () => {
        const insertFee = `
          INSERT INTO transaksi_fee_detail (transaksi_id, tanggal_tindakan, pegawai_tipe, pegawai_id, nama_pegawai, jabatan, fee_nominal)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const qNames = `
          SELECT 
            d1.nama AS nama_dok1, d2.nama AS nama_dok2,
            s1.nama AS nama_sus1, s2.nama AS nama_sus2, s3.nama AS nama_sus3, srawat.nama AS nama_sus_rawat
          FROM transaksi_medis t
          LEFT JOIN master_dokter d1 ON ? = d1.id
          LEFT JOIN master_dokter d2 ON ? = d2.id
          LEFT JOIN master_suster s1 ON ? = s1.id
          LEFT JOIN master_suster s2 ON ? = s2.id
          LEFT JOIN master_suster s3 ON ? = s3.id
          LEFT JOIN master_suster srawat ON ? = srawat.id
          WHERE t.id = ?
        `;

        db.query(qNames, [dokter_id, dokter2_id, suster_op1_id, suster_op2_id, suster_op3_id, suster_rawat_id, id], (errNames, nameRows) => {
          if (!errNames && nameRows.length > 0) {
            const names = nameRows[0];

            // 1. Dokter Utama
            if (dokter_id && feeDokter1 > 0) {
              db.query(insertFee, [id, tanggalTindakan, 'DOKTER', dokter_id, names.nama_dok1 || 'Dokter Utama', 'Dokter Utama', feeDokter1]);
            }

            // 2. Dokter 2
            if (dokter2_id && feeDokter2 > 0) {
              db.query(insertFee, [id, tanggalTindakan, 'DOKTER', dokter2_id, names.nama_dok2 || 'Dokter 2', 'Dokter Pendukung', feeDokter2]);
            }

            // 3. Dokter Anestesi (Dibagi rata ke SEMUA dokter anestesi aktif di master_dokter)
            if (bAnestesi > 0) {
              db.query(`SELECT id, nama FROM master_dokter WHERE LOWER(fokus) LIKE '%anestesi%' OR LOWER(nama) LIKE '%anestesi%'`, (errAnes, listAnes) => {
                if (!errAnes && listAnes && listAnes.length > 0) {
                  const feePerAnes = bAnestesi / listAnes.length;
                  listAnes.forEach(dokAnes => {
                    db.query(insertFee, [id, tanggalTindakan, 'DOKTER', dokAnes.id, dokAnes.nama, 'Dokter Anestesi', feePerAnes]);
                  });
                }
              });
            }

            // 4. Suster Operasi (Diterima UTUH per orang, tidak dibagi rata)
            if (suster_op1_id && bSusterOp > 0) {
              db.query(insertFee, [id, tanggalTindakan, 'SUSTER', suster_op1_id, names.nama_sus1 || 'Suster OP 1', 'Suster - OPERASI', bSusterOp]);
            }
            if (suster_op2_id && bSusterOp > 0) {
              db.query(insertFee, [id, tanggalTindakan, 'SUSTER', suster_op2_id, names.nama_sus2 || 'Suster OP 2', 'Suster - OPERASI', bSusterOp]);
            }
            if (suster_op3_id && bSusterOp > 0) {
              db.query(insertFee, [id, tanggalTindakan, 'SUSTER', suster_op3_id, names.nama_sus3 || 'Suster OP 3', 'Suster - OPERASI', bSusterOp]);
            }

            // 5. Suster Rawat / Jaga (Dibagi rata ke SEMUA suster rawat/jaga aktif di master_suster)
            if (bSusterRawat > 0) {
              db.query(`SELECT id, nama FROM master_suster WHERE LOWER(peran) LIKE '%rawat%' OR LOWER(peran) LIKE '%jaga%'`, (errRawat, listRawat) => {
                if (!errRawat && listRawat && listRawat.length > 0) {
                  const feePerRawat = bSusterRawat / listRawat.length;
                  listRawat.forEach(susRawat => {
                    db.query(insertFee, [id, tanggalTindakan, 'SUSTER', susRawat.id, susRawat.nama, 'Suster - JAGA', feePerRawat]);
                  });
                }
              });
            }
          }

          res.redirect('/finalisasi');
        });
      });
    });
  });
};