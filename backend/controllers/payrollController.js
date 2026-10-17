const db = require('../config/db');

// 1. Tampilkan Daftar Periode Payroll
exports.getPayrollPeriode = (req, res) => {
  const query = `SELECT * FROM payroll_periode ORDER BY tahun DESC, bulan DESC`;
  
  db.query(query, (err, periodes) => {
    if (err) {
      console.error("Database Error (Get Periode Payroll):", err);
      return res.status(500).send("Database Error: " + err.message);
    }
    res.render('payroll_periode', { periodes: periodes || [] });
  });
};

// 2. Tampilkan Detail Rincian Gaji Berdasarkan Periode
exports.getPayrollDetail = (req, res) => {
  const periodeId = req.query.periode_id;
  if (!periodeId) return res.redirect('/payroll');

  const qPeriode = `SELECT * FROM payroll_periode WHERE id = ?`;
  const qDetail = `SELECT * FROM payroll_detail WHERE payroll_periode_id = ?`;

  db.query(qPeriode, [periodeId], (err, periodeRes) => {
    if (err || periodeRes.length === 0) return res.status(404).send("Periode payroll tidak ditemukan.");
    
    db.query(qDetail, [periodeId], (err, details) => {
      if (err) {
        console.error("Database Error (Get Detail Payroll):", err);
        return res.status(500).send("Database Error: " + err.message);
      }

      const allDetails = details || [];
      const dokters = allDetails.filter(d => d.jabatan && d.jabatan.toLowerCase().includes('dokter'));
      const karyawans = allDetails.filter(d => !d.jabatan || !d.jabatan.toLowerCase().includes('dokter'));

      res.render('payroll_detail', {
        periode: periodeRes[0],
        karyawans: karyawans,
        dokters: dokters
      });
    });
  });
};

// 3. Proses Hitung & Generate Payroll Otomatis
exports.generatePayroll = (req, res) => {
  const { bulan, tahun } = req.body;
  if (!bulan || !tahun) return res.status(400).send("Bulan dan Tahun harus diisi.");

  const checkQuery = `SELECT id FROM payroll_periode WHERE bulan = ? AND tahun = ?`;
  db.query(checkQuery, [bulan, tahun], (err, existing) => {
    if (err) return res.status(500).send("Database Error: " + err.message);

    let periodeId;

    if (existing.length > 0) {
      periodeId = existing[0].id;
      processPayrollCalculation(periodeId, Number(bulan), Number(tahun), res);
    } else {
      const insertPeriode = `INSERT INTO payroll_periode (bulan, tahun, status) VALUES (?, ?, 'OPEN')`;
      db.query(insertPeriode, [bulan, tahun], (err, result) => {
        if (err) return res.status(500).send("Database Error: " + err.message);
        periodeId = result.insertId;
        processPayrollCalculation(periodeId, Number(bulan), Number(tahun), res);
      });
    }
  });
};

// 4. CETAK SLIP GAJI PEGAWAI / DOKTER / SUSTER
exports.cetakSlipGaji = (req, res) => {
  const { pegawai_id, pegawai_tipe, bulan, tahun } = req.query;

  if (!pegawai_id || !pegawai_tipe || !bulan || !tahun) {
    return res.status(400).send("Parameter cetak slip tidak lengkap.");
  }

  // Cari periode payroll terlebih dahulu
  const qPeriode = `SELECT id FROM payroll_periode WHERE bulan = ? AND tahun = ?`;
  db.query(qPeriode, [bulan, tahun], (err, pRes) => {
    if (err || pRes.length === 0) {
      return res.status(404).send("Data periode payroll untuk bulan/tahun tersebut belum digenerate.");
    }
    const periodeId = pRes[0].id;

    // Ambil data ringkasan gaji dari tabel payroll_detail
    const querySlip = `
      SELECT * FROM payroll_detail 
      WHERE payroll_periode_id = ? AND pegawai_id = ? AND pegawai_tipe = ?
    `;

    db.query(querySlip, [periodeId, pegawai_id, pegawai_tipe], (err, slipRows) => {
      if (err || slipRows.length === 0) {
        return res.status(404).send("Data rincian gaji pegawai tidak ditemukan pada periode ini.");
      }

      const slipData = slipRows[0];
      const isMedis = pegawai_tipe === 'DOKTER' || pegawai_tipe === 'SUSTER';

      // Jika Dokter atau Suster, ambil juga rincian fee tindakan di halaman kedua dan seterusnya
      if (isMedis) {
        const queryRincianFee = `
          SELECT f.*, t.nama_pasien, t.jenis_tindakan
          FROM transaksi_fee_detail f
          JOIN transaksi_medis t ON f.transaksi_id = t.id
          WHERE f.pegawai_id = ? AND f.pegawai_tipe = ?
            AND MONTH(f.tanggal_tindakan) = ? AND YEAR(f.tanggal_tindakan) = ?
          ORDER BY f.tanggal_tindakan ASC
        `;

        db.query(queryRincianFee, [pegawai_id, pegawai_tipe, bulan, tahun], (errFee, rincianRows) => {
          if (errFee) {
            console.error("Database Error (Rincian Fee):", errFee);
          }

          res.render('print_slip', {
            slip: slipData,
            rincianFee: rincianRows || [],
            isMedis: true,
            bulan: bulan,
            tahun: tahun
          });
        });
      } else {
        // Jika Karyawan biasa, cukup cetak slip ringkasan 1 lembar
        res.render('print_slip', {
          slip: slipData,
          rincianFee: [],
          isMedis: false,
          bulan: bulan,
          tahun: tahun
        });
      }
    });
  });
};

// PPh 21 TER Karyawan & Suster
function hitungTarifPph21Ter(bruto, statusPtkp) {
  const kategori = (statusPtkp || 'TK/0').toUpperCase().trim();
  let tarif = 0;
  if (bruto > 5400000 && bruto <= 5650000) tarif = 0.0025;
  else if (bruto > 5650000 && bruto <= 5950000) tarif = 0.005;
  else if (bruto > 5950000 && bruto <= 6300000) tarif = 0.0075;
  else if (bruto > 6300000 && bruto <= 6750000) tarif = 0.01;
  else if (bruto > 6750000 && bruto <= 7500000) tarif = 0.0125;
  else if (bruto > 7500000 && bruto <= 8550000) tarif = 0.015;
  else if (bruto > 8550000 && bruto <= 9650000) tarif = 0.0175;
  else if (bruto > 9650000 && bruto <= 10050000) tarif = 0.02;
  else if (bruto > 10050000 && bruto <= 10350000) tarif = 0.0225;
  else if (bruto > 10350000 && bruto <= 10700000) tarif = 0.025;
  else if (bruto > 10700000 && bruto <= 11050000) tarif = 0.03;
  else if (bruto > 11050000 && bruto <= 11600000) tarif = 0.035;
  else if (bruto > 11600000 && bruto <= 12500000) tarif = 0.04;
  else if (bruto > 12500000 && bruto <= 13750000) tarif = 0.05;
  else if (bruto > 13750000 && bruto <= 15100000) tarif = 0.06;
  else if (bruto > 15100000 && bruto <= 16950000) tarif = 0.07;
  else if (bruto > 16950000 && bruto <= 19750000) tarif = 0.08;
  else if (bruto > 19750000 && bruto <= 24150000) tarif = 0.09;
  else if (bruto > 24150000 && bruto <= 26450000) tarif = 0.10;
  else if (bruto > 26450000 && bruto <= 28000000) tarif = 0.11;
  else if (bruto > 28000000 && bruto <= 30050000) tarif = 0.12;
  else if (bruto > 30050000 && bruto <= 32400000) tarif = 0.13;
  else if (bruto > 32400000 && bruto <= 35400000) tarif = 0.14;
  else if (bruto > 35400000 && bruto <= 39100000) tarif = 0.15;
  else if (bruto > 39100000 && bruto <= 43850000) tarif = 0.16;
  else if (bruto > 43850000 && bruto <= 47800000) tarif = 0.17;
  else if (bruto > 47800000 && bruto <= 51400000) tarif = 0.18;
  else if (bruto > 51400000 && bruto <= 56300000) tarif = 0.19;
  else if (bruto > 56300000 && bruto <= 62200000) tarif = 0.20;
  else if (bruto > 62200000 && bruto <= 68600000) tarif = 0.21;
  else if (bruto > 68600000 && bruto <= 77500000) tarif = 0.22;
  else if (bruto > 77500000 && bruto <= 89000000) tarif = 0.23;
  else if (bruto > 89000000) tarif = 0.24;

  return Math.round(bruto * tarif);
}

// PPh 21 Dokter Progresif
function hitungPph21DokterProgresif(dppBulanIni, dppKumulatifSebelumnya) {
  const totalDppKumulatif = dppKumulatifSebelumnya + dppBulanIni;
  const batasTier1 = 60000000;
  const batasTier2 = 250000000;
  const batasTier3 = 500000000;
  const batasTier4 = 5000000000;

  function hitungPajakKumulatif(kumulatif) {
    let pajak = 0, sisa = kumulatif;
    if (sisa > 0) { const p = Math.min(sisa, batasTier1); pajak += p * 0.05; sisa -= p; }
    if (sisa > 0) { const p = Math.min(sisa, batasTier2 - batasTier1); pajak += p * 0.15; sisa -= p; }
    if (sisa > 0) { const p = Math.min(sisa, batasTier3 - batasTier2); pajak += p * 0.25; sisa -= p; }
    if (sisa > 0) { const p = Math.min(sisa, batasTier4 - batasTier3); pajak += p * 0.30; sisa -= p; }
    if (sisa > 0) { pajak += sisa * 0.35; }
    return pajak;
  }

  return Math.round(hitungPajakKumulatif(totalDppKumulatif) - hitungPajakKumulatif(dppKumulatifSebelumnya));
}

// Proses Kalkulasi Utama Menggunakan Tabel transaksi_fee_detail & master_lembur
function processPayrollCalculation(periodeId, bulan, tahun, res) {
  const clearOld = `DELETE FROM payroll_detail WHERE payroll_periode_id = ?`;
  
  db.query(clearOld, [periodeId], async (err) => {
    if (err) console.error("Error clearing old payroll detail:", err);

    try {
      // 0. Ambil Data Lembur Berdasarkan Tabel master_lembur untuk Bulan & Tahun Terkait
      const lemburRes = await new Promise((resolve, reject) => {
        const qLembur = `
          SELECT nik, COALESCE(SUM(nominal_lembur), 0) AS total_lembur 
          FROM master_lembur 
          WHERE bulan = ? AND tahun = ? 
          GROUP BY nik
        `;
        db.query(qLembur, [bulan, tahun], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      });

      // Pemetaan total lembur per NIK pegawai
      const mapLembur = {};
      lemburRes.forEach(row => {
        mapLembur[row.nik] = Number(row.total_lembur || 0);
      });

      // 1. Karyawan
      const karyawans = await new Promise((resolve, reject) => {
        db.query(`SELECT id, nik, nama_karyawan, jabatan, gaji_pokok, tunjangan_jabatan, status_ptkp FROM master_karyawan`, (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      });

      // 2. Suster
      const susters = await new Promise((resolve, reject) => {
        const qSuster = `
          SELECT 
            s.id AS suster_id, s.nik, s.nama AS nama, CONCAT('Suster - ', COALESCE(s.peran, 'Umum')) AS jabatan, 
            s.gaji_pokok, s.tunjangan_jabatan, 
            COALESCE(SUM(f.fee_nominal), 0) AS fee_tindakan, 
            s.status_ptkp
          FROM master_suster s
          LEFT JOIN transaksi_fee_detail f ON s.id = f.pegawai_id AND f.pegawai_tipe = 'SUSTER' 
            AND MONTH(f.tanggal_tindakan) = ? AND YEAR(f.tanggal_tindakan) = ?
          GROUP BY s.id, s.nik, s.nama, s.peran, s.gaji_pokok, s.tunjangan_jabatan, s.status_ptkp
        `;
        db.query(qSuster, [bulan, tahun], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      });

      // 3. Dokter
      const dokters = await new Promise((resolve, reject) => {
        const qDokter = `
          SELECT 
            d.id AS dokter_id, 
            '-' AS nik, 
            d.nama AS nama, 
            CONCAT('Dokter - ', COALESCE(d.fokus, 'Umum')) AS jabatan, 
            COALESCE(SUM(f.fee_nominal), 0) AS fee_tindakan 
          FROM master_dokter d
          LEFT JOIN transaksi_fee_detail f ON d.id = f.pegawai_id AND f.pegawai_tipe = 'DOKTER' 
            AND MONTH(f.tanggal_tindakan) = ? AND YEAR(f.tanggal_tindakan) = ?
          GROUP BY d.id, d.nama, d.fokus
        `;
        db.query(qDokter, [bulan, tahun], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      });

      // 4. Akumulasi DPP Dokter Sebelumnya
      const akumulasiRes = await new Promise((resolve, reject) => {
        const qAkum = `
          SELECT pegawai_id AS dokter_id, COALESCE(SUM(fee_nominal * 0.50), 0) AS dpp_kumulatif_lalu 
          FROM transaksi_fee_detail 
          WHERE pegawai_tipe = 'DOKTER' AND YEAR(tanggal_tindakan) = ? AND MONTH(tanggal_tindakan) < ? 
          GROUP BY pegawai_id
        `;
        db.query(qAkum, [tahun, bulan], (err, rows) => {
          if (err) reject(err); else resolve(rows || []);
        });
      });

      const mapAkumulasi = {};
      akumulasiRes.forEach(row => { mapAkumulasi[row.dokter_id] = Number(row.dpp_kumulatif_lalu || 0); });

      const listKaryawan = karyawans.map(k => ({
        pegawai_id: k.id, pegawai_tipe: 'KARYAWAN',
        nik: k.nik || '-', nama: k.nama_karyawan, jabatan: k.jabatan || 'Karyawan',
        gaji_pokok: Number(k.gaji_pokok || 0), tunjangan_jabatan: Number(k.tunjangan_jabatan || 0),
        fee_tindakan: 0, status_ptkp: k.status_ptkp || 'TK/0', is_dokter: false,
        lembur: mapLembur[k.nik] || 0
      }));

      const listSuster = susters.map(s => ({
        pegawai_id: s.suster_id, pegawai_tipe: 'SUSTER',
        nik: s.nik || '-', nama: s.nama, jabatan: s.jabatan,
        gaji_pokok: Number(s.gaji_pokok || 0), tunjangan_jabatan: Number(s.tunjangan_jabatan || 0),
        fee_tindakan: Number(s.fee_tindakan || 0), status_ptkp: s.status_ptkp || 'TK/0', is_dokter: false,
        lembur: mapLembur[s.nik] || 0
      }));

      const listDokter = dokters.map(d => {
        const feeTindakan = Number(d.fee_tindakan || 0);
        const dppBulanIni = feeTindakan * 0.50;
        const pph21 = hitungPph21DokterProgresif(dppBulanIni, mapAkumulasi[d.dokter_id] || 0);

        return {
          pegawai_id: d.dokter_id, pegawai_tipe: 'DOKTER',
          nik: '-', nama: d.nama, jabatan: d.jabatan,
          gaji_pokok: 0, tunjangan_jabatan: 0, fee_tindakan: feeTindakan,
          status_ptkp: 'TK/0', is_dokter: true, potongan_pph21: pph21,
          lembur: 0
        };
      });

      const semuaPegawai = [...listKaryawan, ...listSuster, ...listDokter];
      if (semuaPegawai.length === 0) return res.redirect('/payroll/detail?periode_id=' + periodeId);

      for (const p of semuaPegawai) {
        // Pendapatan kotor dihitung dari: Gaji Pokok + Tunjangan Jabatan + Fee Tindakan + Nominal Lembur
        const pendapatanKotor = p.gaji_pokok + p.tunjangan_jabatan + p.fee_tindakan + p.lembur;
        const potonganBpjsKes = p.is_dokter ? 0 : Math.min(p.gaji_pokok, 12000000) * 0.01;
        const potonganBpjsTk = p.is_dokter ? 0 : Math.min(p.gaji_pokok, 11086300) * 0.03;
        const potonganPph21 = p.is_dokter ? p.potongan_pph21 : hitungTarifPph21Ter(p.gaji_pokok + p.tunjangan_jabatan, p.status_ptkp);
        const totalPotongan = potonganBpjsKes + potonganBpjsTk + potonganPph21;
        const takeHomePay = pendapatanKotor - totalPotongan;

        const insertDetail = `
          INSERT INTO payroll_detail 
          (payroll_periode_id, pegawai_id, pegawai_tipe, nik, nama_karyawan, jabatan, gaji_pokok, tunjangan_jabatan, fee_tindakan, lembur, pendapatan_kotor, potongan_bpjs_kes, potongan_bpjs_tk, potongan_pph21, total_potongan, take_home_pay)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await new Promise((resolve) => {
          db.query(insertDetail, [
            periodeId, p.pegawai_id, p.pegawai_tipe, p.nik, p.nama, p.jabatan, p.gaji_pokok, p.tunjangan_jabatan, p.fee_tindakan, p.lembur, pendapatanKotor, potonganBpjsKes, potonganBpjsTk, potonganPph21, totalPotongan, takeHomePay
          ], () => resolve());
        });
      }

      return res.redirect('/payroll/detail?periode_id=' + periodeId);
    } catch (error) {
      console.error("Error generating payroll:", error);
      return res.status(500).send("Terjadi kesalahan: " + error.message);
    }
  });
};