const db = require('../config/db');

// Tampilkan halaman daftar lembur & form input
exports.getLemburPage = (req, res) => {
  const bulan = parseInt(req.query.bulan) || (new Date().getMonth() + 1);
  const tahun = parseInt(req.query.tahun) || new Date().getFullYear();

  // Ambil daftar gabungan pegawai dari master_karyawan dan master_suster berdasarkan NIK
    const queryPegawai = `
        SELECT nik, nama_karyawan, jabatan, gaji_pokok FROM master_karyawan
        UNION
        SELECT nik, nama AS nama_karyawan, peran AS jabatan, gaji_pokok FROM master_suster
        ORDER BY nama_karyawan ASC
    `;

  // Ambil data lembur pada bulan & tahun tertentu dengan menggabungkan ke kedua tabel master
  const queryLembur = `
    SELECT l.*, 
           COALESCE(k.nama_karyawan, s.nama) AS nama_karyawan, 
           COALESCE(k.jabatan, s.peran) AS jabatan,
           COALESCE(k.gaji_pokok, s.gaji_pokok, 0) AS gaji_pokok
    FROM master_lembur l
    LEFT JOIN master_karyawan k ON l.nik = k.nik
    LEFT JOIN master_suster s ON l.nik = s.nik
    WHERE l.bulan = ? AND l.tahun = ?
    ORDER BY l.created_at DESC
  `;

  db.query(queryPegawai, (err, karyawans) => {
    if (err) {
      console.error("Database Error (Pegawai):", err);
      return res.status(500).send("Database Error: " + err.message);
    }

    db.query(queryLembur, [bulan, tahun], (err, lemburs) => {
      if (err) {
        console.error("Database Error (Lembur):", err);
        return res.status(500).send("Database Error: " + err.message);
      }

      res.render('lembur', {
        karyawans: karyawans || [],
        lemburs: lemburs || [],
        bulan: bulan,
        tahun: tahun
      });
    });
  });
};

// Proses Simpan Data Lembur
exports.storeLembur = (req, res) => {
  const { nik, bulan, tahun, jumlah_jam, keterangan } = req.body;

  if (!nik || !bulan || !tahun || !jumlah_jam) {
    return res.status(400).send("Semua field wajib diisi!");
  }

  // Cek Gaji Pokok dari master_karyawan atau master_suster berdasarkan NIK
  const queryGaji = `
    SELECT gaji_pokok FROM master_karyawan WHERE nik = ?
    UNION
    SELECT gaji_pokok FROM master_suster WHERE nik = ?
    LIMIT 1
  `;

  db.query(queryGaji, [nik, nik], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("Gagal mengambil data gaji pegawai atau Pegawai tidak ditemukan.");
    }

    const gajiPokok = Number(results[0].gaji_pokok || 0);

    // Hitung nominal lembur menggunakan rumus normatif: (1 / 173) * Gaji Pokok * Jumlah Jam Lembur
    const upahPerJam = gajiPokok / 173;
    const nominalLembur = upahPerJam * parseFloat(jumlah_jam);

    // Simpan ke tabel master_lembur
    const queryInsert = `
      INSERT INTO master_lembur (nik, bulan, tahun, jumlah_jam, nominal_lembur, keterangan)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(queryInsert, [nik, bulan, tahun, jumlah_jam, nominalLembur, keterangan || '-'], (err) => {
      if (err) {
        console.error("Database Error (Insert Lembur):", err);
        return res.status(500).send("Gagal menyimpan data lembur: " + err.message);
      }

      res.redirect(`/lembur?bulan=${bulan}&tahun=${tahun}`);
    });
  });
};

// Proses Hapus Data Lembur
exports.deleteLembur = (req, res) => {
  const { id } = req.params;
  const { bulan, tahun } = req.query;

  const queryDelete = 'DELETE FROM master_lembur WHERE id = ?';
  db.query(queryDelete, [id], (err) => {
    if (err) {
      console.error("Database Error (Delete Lembur):", err);
      return res.status(500).send("Gagal menghapus lembur.");
    }

    res.redirect(`/lembur?bulan=${bulan || new Date().getMonth() + 1}&tahun=${tahun || new Date().getFullYear()}`);
  });
};