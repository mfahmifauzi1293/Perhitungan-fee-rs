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

  const qPeriode = `SELECT id FROM payroll_periode WHERE bulan = ? AND tahun = ?`;
  db.query(qPeriode, [bulan, tahun], (err, pRes) => {
    if (err || pRes.length === 0) {
      return res.status(404).send("Data periode payroll untuk bulan/tahun tersebut belum digenerate.");
    }
    const periodeId = pRes[0].id;

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

// ==========================================
// PENGELOMPOKAN & KALKULASI TARIF PPh 21 TER (A, B, C)
// ==========================================
function hitungTarifPph21Ter(bruto, statusPtkp) {
  const ptkp = (statusPtkp || 'TK/0').toUpperCase().trim();
  let tarif = 0;

  // 1. Kategori TER A: TK/0, TK/1, K/0[cite: 7]
  if (['TK/0', 'TK1', 'TK/1', 'K/0', 'K0'].includes(ptkp)) {
    if (bruto > 5400000 && bruto <= 5650000) tarif = 0.0025;
    else if (bruto > 5650000 && bruto <= 5950000) tarif = 0.0050;
    else if (bruto > 5950000 && bruto <= 6300000) tarif = 0.0075;
    else if (bruto > 6300000 && bruto <= 6750000) tarif = 0.0100;
    else if (bruto > 6750000 && bruto <= 7500000) tarif = 0.0125;
    else if (bruto > 7500000 && bruto <= 8550000) tarif = 0.0150;
    else if (bruto > 8550000 && bruto <= 9650000) tarif = 0.0175;
    else if (bruto > 9650000 && bruto <= 10050000) tarif = 0.0200;
    else if (bruto > 10050000 && bruto <= 10350000) tarif = 0.0225;
    else if (bruto > 10350000 && bruto <= 10700000) tarif = 0.0250;
    else if (bruto > 10700000 && bruto <= 11050000) tarif = 0.0300;
    else if (bruto > 11050000 && bruto <= 11600000) tarif = 0.0350;
    else if (bruto > 11600000 && bruto <= 12500000) tarif = 0.0400;
    else if (bruto > 12500000 && bruto <= 13750000) tarif = 0.0500;
    else if (bruto > 13750000 && bruto <= 15100000) tarif = 0.0600;
    else if (bruto > 15100000 && bruto <= 16950000) tarif = 0.0700;
    else if (bruto > 16950000 && bruto <= 19750000) tarif = 0.0800;
    else if (bruto > 19750000 && bruto <= 24150000) tarif = 0.0900;
    else if (bruto > 24150000 && bruto <= 26450000) tarif = 0.1000;
    else if (bruto > 26450000 && bruto <= 28000000) tarif = 0.1100;
    else if (bruto > 28000000 && bruto <= 30050000) tarif = 0.1200;
    else if (bruto > 30050000 && bruto <= 32400000) tarif = 0.1300;
    else if (bruto > 32400000 && bruto <= 35400000) tarif = 0.1400;
    else if (bruto > 35400000 && bruto <= 39100000) tarif = 0.1500;
    else if (bruto > 39100000 && bruto <= 43850000) tarif = 0.1600;
    else if (bruto > 43850000 && bruto <= 47800000) tarif = 0.1700;
    else if (bruto > 47800000 && bruto <= 51400000) tarif = 0.1800;
    else if (bruto > 51400000 && bruto <= 56300000) tarif = 0.1900;
    else if (bruto > 56300000 && bruto <= 62200000) tarif = 0.2000;
    else if (bruto > 62200000 && bruto <= 68600000) tarif = 0.2100;
    else if (bruto > 68600000 && bruto <= 75000000) tarif = 0.2200;
    else if (bruto > 75000000) tarif = 0.2200;
  }
  // 2. Kategori TER B: TK/2, TK/3, K/1, K/2[cite: 7]
  else if (['TK/2', 'TK2', 'TK/3', 'TK3', 'K/1', 'K1', 'K/2', 'K2'].includes(ptkp)) {
    if (bruto > 6200000 && bruto <= 6500000) tarif = 0.0025;
    else if (bruto > 6500000 && bruto <= 6850000) tarif = 0.0050;
    else if (bruto > 6850000 && bruto <= 7300000) tarif = 0.0075;
    else if (bruto > 7300000 && bruto <= 9200000) tarif = 0.0100;
    else if (bruto > 9200000 && bruto <= 10750000) tarif = 0.0150;
    else if (bruto > 10750000 && bruto <= 11250000) tarif = 0.0200;
    else if (bruto > 11250000 && bruto <= 11600000) tarif = 0.0250;
    else if (bruto > 11600000 && bruto <= 12600000) tarif = 0.0300;
    else if (bruto > 12600000 && bruto <= 13600000) tarif = 0.0400;
    else if (bruto > 13600000 && bruto <= 14950000) tarif = 0.0500;
    else if (bruto > 14950000 && bruto <= 16400000) tarif = 0.0600;
    else if (bruto > 16400000 && bruto <= 18450000) tarif = 0.0700;
    else if (bruto > 18450000 && bruto <= 21850000) tarif = 0.0800;
    else if (bruto > 21850000 && bruto <= 26000000) tarif = 0.0900;
    else if (bruto > 26000000 && bruto <= 27700000) tarif = 0.1000;
    else if (bruto > 27700000 && bruto <= 29350000) tarif = 0.1100;
    else if (bruto > 29350000 && bruto <= 31450000) tarif = 0.1200;
    else if (bruto > 31450000 && bruto <= 33950000) tarif = 0.1300;
    else if (bruto > 33950000 && bruto <= 37100000) tarif = 0.1400;
    else if (bruto > 37100000 && bruto <= 41100000) tarif = 0.1500;
    else if (bruto > 41100000 && bruto <= 45800000) tarif = 0.1600;
    else if (bruto > 45800000 && bruto <= 49500000) tarif = 0.1700;
    else if (bruto > 49500000 && bruto <= 53800000) tarif = 0.1800;
    else if (bruto > 53800000 && bruto <= 58500000) tarif = 0.1900;
    else if (bruto > 58500000 && bruto <= 64000000) tarif = 0.2000;
    else if (bruto > 64000000 && bruto <= 71000000) tarif = 0.2100;
    else if (bruto > 71000000 && bruto <= 75000000) tarif = 0.2200;
    else if (bruto > 75000000) tarif = 0.2200;
  }
  // 3. Kategori TER C: K/3[cite: 7]
  else if (['K/3', 'K3'].includes(ptkp)) {
    if (bruto > 6600000 && bruto <= 6950000) tarif = 0.0025;
    else if (bruto > 6950000 && bruto <= 7350000) tarif = 0.0050;
    else if (bruto > 7350000 && bruto <= 7800000) tarif = 0.0075;
    else if (bruto > 7800000 && bruto <= 8850000) tarif = 0.0100;
    else if (bruto > 8850000 && bruto <= 9800000) tarif = 0.0125;
    else if (bruto > 9800000 && bruto <= 10950000) tarif = 0.0150;
    else if (bruto > 10950000 && bruto <= 11200000) tarif = 0.0175;
    else if (bruto > 11200000 && bruto <= 12050000) tarif = 0.0200;
    else if (bruto > 12050000 && bruto <= 12950000) tarif = 0.0300;
    else if (bruto > 12950000 && bruto <= 14150000) tarif = 0.0400;
    else if (bruto > 14150000 && bruto <= 15550000) tarif = 0.0500;
    else if (bruto > 15550000 && bruto <= 17050000) tarif = 0.0600;
    else if (bruto > 17050000 && bruto <= 19500000) tarif = 0.0700;
    else if (bruto > 19500000 && bruto <= 22700000) tarif = 0.0800;
    else if (bruto > 22700000 && bruto <= 26600000) tarif = 0.0900;
    else if (bruto > 26600000 && bruto <= 28100000) tarif = 0.1000;
    else if (bruto > 28100000 && bruto <= 30100000) tarif = 0.1100;
    else if (bruto > 30100000 && bruto <= 32600000) tarif = 0.1200;
    else if (bruto > 32600000 && bruto <= 35400000) tarif = 0.1300;
    else if (bruto > 35400000 && bruto <= 38900000) tarif = 0.1400;
    else if (bruto > 38900000 && bruto <= 43000000) tarif = 0.1500;
    else if (bruto > 43000000 && bruto <= 47400000) tarif = 0.1600;
    else if (bruto > 47400000 && bruto <= 51200000) tarif = 0.1700;
    else if (bruto > 51200000 && bruto <= 55800000) tarif = 0.1800;
    else if (bruto > 55800000 && bruto <= 60400000) tarif = 0.1900;
    else if (bruto > 60400000 && bruto <= 66700000) tarif = 0.2000;
    else if (bruto > 66700000 && bruto <= 74500000) tarif = 0.2100;
    else if (bruto > 74500000 && bruto <= 75000000) tarif = 0.2200;
    else if (bruto > 75000000) tarif = 0.2200;
  }

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

// Proses Kalkulasi Utama
function processPayrollCalculation(periodeId, bulan, tahun, res) {
  const clearOld = `DELETE FROM payroll_detail WHERE payroll_periode_id = ?`;
  
  db.query(clearOld, [periodeId], async (err) => {
    if (err) console.error("Error clearing old payroll detail:", err);

    try {
      // 0. Ambil Data Lembur Berdasarkan Tabel master_lembur
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
        // Pendapatan kotor / bruto = Gaji Pokok + Tunjangan + Fee Tindakan + Lembur
        const pendapatanKotor = p.gaji_pokok + p.tunjangan_jabatan + p.fee_tindakan + p.lembur;
        const potonganBpjsKes = p.is_dokter ? 0 : Math.min(p.gaji_pokok, 12000000) * 0.01;
        const potonganBpjsTk = p.is_dokter ? 0 : Math.min(p.gaji_pokok, 11086300) * 0.03;
        
        // PPh 21 menggunakan Bruto total sebagai dasar pengenaan tarif TER (A, B, atau C berdasarkan status PTKP)
        const potonganPph21 = p.is_dokter ? p.potongan_pph21 : hitungTarifPph21Ter(pendapatanKotor, p.status_ptkp);
        
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