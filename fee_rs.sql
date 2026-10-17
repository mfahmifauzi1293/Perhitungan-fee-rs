-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Okt 2026 pada 16.47
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fee_rs`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_dokter`
--

CREATE TABLE `master_dokter` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tipe` enum('DOKTER_OPERASI','DOKTER_TREATMENT','DOKTER_ANESTESI') NOT NULL,
  `fokus` enum('BEDAH','ANESTESI','TREATMENT') DEFAULT 'BEDAH',
  `foto` varchar(255) DEFAULT NULL,
  `jadwal` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_dokter`
--

INSERT INTO `master_dokter` (`id`, `nama`, `tipe`, `fokus`, `foto`, `jadwal`, `deskripsi`) VALUES
(1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'DOKTER_OPERASI', 'BEDAH', '1791874672145.avif', 'Senin (08.00 - 14.00), Selasa (14.00 - 20.00), Rabu (14.00 - 20.00), Sabtu (08.00 - 14.00)', 'dr. Teuku Adifitrian, Sp.BP-RE adalah dokter spesialis bedah plastik, rekonstruksi, dan estetik yang berfokus pada tindakan bedah plastik untuk rekonstruksi maupun peningkatan estetika dan bentuk tubuh.'),
(2, 'dr. Hendra T Hartono, SpBP-RE', 'DOKTER_OPERASI', 'BEDAH', NULL, 'Selasa (08.00 - 14.00), Kamis (14.00 - 20.00)', 'dr. Hendra T. Hartono, Sp.BP-RE adalah dokter spesialis bedah plastik, rekonstruksi, dan estetik yang menangani berbagai prosedur bedah plastik untuk kebutuhan rekonstruksi dan estetika.'),
(3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'DOKTER_OPERASI', 'BEDAH', NULL, 'Rabu (08.00 - 14.00), Jumat (14.00 - 20.00)', 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE adalah dokter spesialis bedah plastik, rekonstruksi, dan estetik yang berfokus pada prosedur bedah plastik untuk memperbaiki bentuk, fungsi, dan estetika tubuh.'),
(4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'DOKTER_OPERASI', 'BEDAH', NULL, 'Kamis (08.00 - 14.00), Sabtu (14.00 - 20.00)', 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE adalah dokter spesialis bedah plastik, rekonstruksi, dan estetik yang menangani berbagai kebutuhan rekonstruksi serta prosedur estetika.'),
(5, 'dr. Laurent L Supit, Sp.BP-RE', 'DOKTER_OPERASI', 'BEDAH', NULL, 'Senin (14.00 - 20.00), Jumat (08.00 - 14.00)', 'dr. Laurent L. Supit, Sp.BP-RE adalah dokter spesialis bedah plastik, rekonstruksi, dan estetik yang berfokus pada prosedur bedah untuk kebutuhan rekonstruksi maupun peningkatan estetika.'),
(6, 'dr. Catharina Ari Wilandani, Sp.D.V.E, FINSDV', 'DOKTER_TREATMENT', 'TREATMENT', NULL, 'Senin (08.00 - 14.00), Selasa (14.00 - 20.00), Kamis (08.00 - 14.00), Jumat (14.00 - 20.00)', 'dr. Catharina Ari Wilandani, Sp.D.V.E, FINSDV adalah dokter spesialis dermatologi, venereologi, dan estetika yang berfokus pada kesehatan kulit, rambut, serta berbagai perawatan dermatologi dan estetika.'),
(7, 'dr. Marsha Bianti, Sp.DVE', 'DOKTER_TREATMENT', 'TREATMENT', NULL, 'Senin (14.00 - 20.00), Rabu (08.00 - 14.00), Kamis (14.00 - 20.00), Sabtu (08.00 - 14.00)', 'dr. Marsha Bianti, Sp.DVE adalah dokter spesialis dermatologi, venereologi, dan estetika yang menangani berbagai masalah kulit serta perawatan dan tindakan estetika.'),
(8, 'dr. Danar Wicaksono, Sp.DVE', 'DOKTER_TREATMENT', 'TREATMENT', NULL, 'Selasa (08.00 - 14.00), Rabu (14.00 - 20.00), Jumat (08.00 - 14.00), Sabtu (14.00 - 20.00)', 'dr. Danar Wicaksono, Sp.DVE adalah dokter spesialis dermatologi, venereologi, dan estetika yang berfokus pada diagnosis serta penanganan berbagai masalah kulit dan perawatan estetika.'),
(9, 'dr. Betardi Aktara, Sp.An', 'DOKTER_ANESTESI', 'ANESTESI', NULL, 'Senin (08.00 - 20.00), Rabu (08.00 - 20.00), Jumat (08.00 - 20.00)', 'dr. Betardi Aktara, Sp.An adalah dokter spesialis anestesiologi yang berfokus pada pemberian dan pengelolaan anestesi serta pemantauan kondisi pasien selama menjalani prosedur medis dan pembedahan.'),
(10, 'dr. Michael Mandagi, Sp.An', 'DOKTER_ANESTESI', 'ANESTESI', NULL, 'Selasa (08.00 - 20.00), Kamis (08.00 - 20.00), Sabtu (08.00 - 20.00)', 'dr. Michael Mandagi, Sp.An adalah dokter spesialis anestesiologi yang berfokus pada manajemen anestesi, pengendalian nyeri, serta pemantauan keselamatan pasien selama tindakan medis dan pembedahan.');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_karyawan`
--

CREATE TABLE `master_karyawan` (
  `id` int(11) NOT NULL,
  `nik` varchar(50) NOT NULL,
  `nama_karyawan` varchar(100) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `gaji_pokok` decimal(15,2) DEFAULT 0.00,
  `tunjangan_jabatan` decimal(15,2) DEFAULT 0.00,
  `status_ptkp` varchar(20) DEFAULT 'TK/0',
  `no_rekening` varchar(50) DEFAULT NULL,
  `nama_bank` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_karyawan`
--

INSERT INTO `master_karyawan` (`id`, `nik`, `nama_karyawan`, `jabatan`, `gaji_pokok`, `tunjangan_jabatan`, `status_ptkp`, `no_rekening`, `nama_bank`, `created_at`) VALUES
(1, 'SMG00001', 'dr. Arti Indira, M.Gizi, Sp.GK, FINEM', 'Direktur Utama', 50000000.00, 2500000.00, 'TK/0', 'NULL', 'NULL', '2026-10-13 10:47:14'),
(2, 'SMG00002', 'Usman Ismail', 'Manager Operasional', 25000000.00, 1000000.00, 'K/3', NULL, NULL, '2026-10-13 10:48:04'),
(3, 'SMG00005', 'Nur Abdi Yanto', 'Assisten Direktur', 15000000.00, 500000.00, 'K/1', NULL, NULL, '2026-10-13 10:48:04'),
(4, 'SMG00007', 'Diana Marliana Sari', 'Asisten Manager Operasional', 10000000.00, 500000.00, 'TK/3', NULL, NULL, '2026-10-13 10:48:04'),
(5, 'SMG00008', 'M Fahmi Fauzy', 'Leader of Finance and Accounting', 11000000.00, 500000.00, 'K/1', NULL, NULL, '2026-10-13 10:48:04'),
(6, 'SMG00009', 'Silvia Indah', 'Finance', 7500000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(7, 'SMG00010', 'Debby', 'Accounting', 8000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(8, 'SMG00011', 'Ferdiyanto', 'Office Boy', 4000000.00, 500000.00, 'K/2', NULL, NULL, '2026-10-13 10:48:04'),
(9, 'SMG00013', 'Dolly Febrizio', 'Office Boy', 4000000.00, 500000.00, 'K/1', NULL, NULL, '2026-10-13 10:48:04'),
(10, 'SMG00014', 'Adi Supratman', 'Leader Of Office Boy and Office Girl', 6000000.00, 500000.00, 'K/2', NULL, NULL, '2026-10-13 10:48:04'),
(11, 'SMG00015', 'Ratna', 'Juru Masak', 4000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(12, 'SMG00018', 'Surtinah', 'Office Girl', 4000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(13, 'SMG00019', 'Septiani', 'Office Girl', 4000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(14, 'SMG00023', 'Diah Permata Sari', 'Admin/Kasir', 4800000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(15, 'SMG00024', 'Desti', 'Admin/Kasir', 4800000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(16, 'SMG00026', 'Ridho Pratama', 'Accounting', 7000000.00, 500000.00, 'K/2', NULL, NULL, '2026-10-13 10:48:04'),
(17, 'SMG00027', 'Marlina', 'Admin/Kasir', 4800000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(18, 'SMG00028', 'Anugrah', 'Office Boy', 4000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(19, 'SMG00029', 'Dwi Lestari', 'Office Girl', 4000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(20, 'SMG00030', 'Sasa Kumala', 'Finance', 6500000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(21, 'SMG00031', 'Sutanto', 'Leader of HRGA', 12500000.00, 500000.00, 'K/3', NULL, NULL, '2026-10-13 10:48:04'),
(22, 'SMG00032', 'Rindu', 'HR', 8000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04'),
(23, 'SMG00033', 'Aziz', 'GA', 7500000.00, 500000.00, 'K/1', NULL, NULL, '2026-10-13 10:48:04'),
(24, 'SMG00034', 'Budi', 'Office Boy', 4000000.00, 500000.00, 'TK/0', NULL, NULL, '2026-10-13 10:48:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_lembur`
--

CREATE TABLE `master_lembur` (
  `id` int(11) NOT NULL,
  `nik` varchar(50) NOT NULL,
  `bulan` int(11) NOT NULL,
  `tahun` int(11) NOT NULL,
  `jumlah_jam` decimal(5,2) DEFAULT 0.00,
  `nominal_lembur` decimal(15,2) DEFAULT 0.00,
  `keterangan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_lembur`
--

INSERT INTO `master_lembur` (`id`, `nik`, `bulan`, `tahun`, `jumlah_jam`, `nominal_lembur`, `keterangan`, `created_at`) VALUES
(1, 'SMG00034', 9, 2026, 15.00, 346820.81, '-', '2026-10-17 14:36:42'),
(2, 'SMG00033', 9, 2026, 4.00, 173410.40, '-', '2026-10-17 14:43:23'),
(3, 'SMG00010', 9, 2026, 8.00, 369942.20, '-', '2026-10-17 14:43:37'),
(4, 'SMG00024', 9, 2026, 12.00, 332947.98, '-', '2026-10-17 14:43:47'),
(5, 'SMG00023', 9, 2026, 10.00, 277456.65, '-', '2026-10-17 14:44:03'),
(6, 'SMG00013', 9, 2026, 20.00, 462427.75, '-', '2026-10-17 14:44:21'),
(7, 'SMG00029', 9, 2026, 12.00, 277456.65, '-', '2026-10-17 14:44:35'),
(8, 'SMG00011', 9, 2026, 18.00, 416184.97, '-', '2026-10-17 14:44:46'),
(9, 'SMG00027', 9, 2026, 10.00, 277456.65, '-', '2026-10-17 14:45:00'),
(10, 'SMG00026', 9, 2026, 3.00, 121387.28, '-', '2026-10-17 14:45:17'),
(11, 'SMG00032', 9, 2026, 6.00, 277456.65, '-', '2026-10-17 14:45:32'),
(12, 'SMG00030', 9, 2026, 8.00, 300578.03, '-', '2026-10-17 14:46:00'),
(13, 'SMG00019', 9, 2026, 12.00, 277456.65, '-', '2026-10-17 14:46:25'),
(14, 'SMG00009', 9, 2026, 6.00, 260115.61, '-', '2026-10-17 14:46:39');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_suster`
--

CREATE TABLE `master_suster` (
  `id` int(11) NOT NULL,
  `nik` varchar(50) DEFAULT NULL,
  `nama` varchar(100) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `tipe` enum('SUSTER_OPERASI','SUSTER_RAWAT','SUSTER_TREATMENT') NOT NULL,
  `peran` enum('OPERASI','TREATMENT','JAGA') DEFAULT 'OPERASI',
  `gaji_pokok` decimal(15,2) DEFAULT 0.00,
  `tunjangan_jabatan` decimal(15,2) DEFAULT 0.00,
  `status_ptkp` varchar(20) DEFAULT 'TK/0',
  `no_rekening` varchar(50) DEFAULT NULL,
  `nama_bank` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_suster`
--

INSERT INTO `master_suster` (`id`, `nik`, `nama`, `foto`, `tipe`, `peran`, `gaji_pokok`, `tunjangan_jabatan`, `status_ptkp`, `no_rekening`, `nama_bank`) VALUES
(1, 'SMG00003', 'Maria Kristine', NULL, 'SUSTER_OPERASI', 'OPERASI', 5500000.00, 300000.00, 'TK/0', NULL, NULL),
(2, 'SMG00004', 'Helen', NULL, 'SUSTER_OPERASI', 'OPERASI', 5500000.00, 300000.00, 'TK/0', NULL, NULL),
(3, 'SMG00006', 'Septya Laili', NULL, 'SUSTER_OPERASI', 'OPERASI', 5500000.00, 300000.00, 'TK/0', NULL, NULL),
(4, 'SMG00016', 'Dian Pertiwi', NULL, 'SUSTER_OPERASI', 'OPERASI', 5000000.00, 300000.00, 'TK/0', NULL, NULL),
(5, 'SMG00025', 'Safira', NULL, 'SUSTER_OPERASI', 'OPERASI', 4500000.00, 300000.00, 'TK/0', NULL, NULL),
(6, 'SMG00020', 'Dewi', NULL, 'SUSTER_RAWAT', 'JAGA', 5000000.00, 300000.00, 'TK/0', NULL, NULL),
(7, 'SMG00012', 'Uli Pandjaitan', NULL, 'SUSTER_RAWAT', 'JAGA', 4500000.00, 300000.00, 'TK/0', NULL, NULL),
(8, 'SMG00017', 'Vanda Agustina', NULL, 'SUSTER_TREATMENT', 'TREATMENT', 5000000.00, 300000.00, 'TK/0', NULL, NULL),
(9, 'SMG00022', 'Rena Safitri', NULL, 'SUSTER_TREATMENT', 'TREATMENT', 5000000.00, 300000.00, 'TK/0', NULL, NULL),
(10, 'SMG00021', 'Octa Nuraini', NULL, 'SUSTER_TREATMENT', 'TREATMENT', 4500000.00, 300000.00, 'TK/0', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_tindakan`
--

CREATE TABLE `master_tindakan` (
  `id` int(11) NOT NULL,
  `kategori` enum('BEDAH','TREATMENT','KONSULTASI','KONTROL') NOT NULL,
  `nama_tindakan` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `harga_standar` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_tindakan`
--

INSERT INTO `master_tindakan` (`id`, `kategori`, `nama_tindakan`, `deskripsi`, `harga_standar`) VALUES
(1, 'BEDAH', 'Facelift', 'bedah untuk mengatasi tanda-tanda penuaan pada wajah seperti kulit kendur, garis wajah yang mulai turun, dan berkurangnya ketegasan kontur wajah. Tujuannya mengembalikan posisi jaringan wajah agar terlihat lebih kencang, proporsional, dan lebih muda secara natural. Metodenya dilakukan melalui tindakan operasi dengan mengangkat dan mengencangkan jaringan wajah serta menyesuaikan kulit yang berlebih.', 150000000.00),
(2, 'BEDAH', 'Rhinoplasty', 'prosedur bedah untuk memperbaiki bentuk dan struktur hidung, baik untuk tujuan estetika maupun fungsi. Tujuannya mendapatkan bentuk hidung yang lebih proporsional dengan wajah sekaligus dapat memperbaiki masalah struktur atau fungsi pernapasan tertentu. Metodenya dilakukan dengan mengubah atau merekonstruksi tulang, tulang rawan, dan jaringan hidung; pada kasus tertentu dapat menggunakan tulang rawan iga sebagai bahan rekonstruksi untuk membentuk atau memperkuat struktur hidung.', 180000000.00),
(3, 'BEDAH', 'Blepharoplasty', 'prosedur bedah pada kelopak mata untuk memperbaiki tampilan kelopak mata atas maupun bawah yang mengalami kulit berlebih, kantung mata, atau perubahan jaringan akibat proses penuaan. Tujuannya membuat area mata terlihat lebih segar, terbuka, dan proporsional. Metodenya dilakukan dengan membuat sayatan pada area kelopak mata untuk mengangkat atau mengatur kembali kulit, lemak, dan jaringan yang berlebih sesuai kebutuhan pasien.', 175000000.00),
(4, 'BEDAH', 'Browlift', 'prosedur bedah untuk mengangkat posisi alis dan jaringan dahi yang mulai turun akibat proses penuaan. Tujuannya membuat area dahi dan alis terlihat lebih terangkat, mengurangi kesan wajah lelah atau berat pada area mata, serta memperbaiki kontur bagian atas wajah. Metodenya dilakukan dengan mengangkat dan mengencangkan jaringan dahi melalui teknik pembedahan yang disesuaikan dengan kondisi pasien.', 120000000.00),
(5, 'BEDAH', 'Mid Facelift', 'prosedur bedah yang berfokus pada area tengah wajah, terutama pipi dan area bawah mata. Tujuannya mengangkat jaringan pipi yang turun, memperbaiki kontur wajah, serta membantu mengurangi tampilan kantung atau cekungan pada area bawah mata sehingga wajah terlihat lebih segar dan muda. Metodenya dilakukan dengan mengangkat dan mereposisi jaringan pada bagian tengah wajah agar kembali ke posisi yang lebih ideal. Beyoutiful juga menggunakan konsep midfacelifting dalam penanganan area bawah mata yang mengalami perubahan akibat penuaan.', 100000000.00),
(6, 'BEDAH', 'Breast Augmentation', 'prosedur bedah untuk menambah volume dan memperbaiki bentuk payudara. Tujuannya membuat payudara terlihat lebih penuh, proporsional, dan sesuai dengan bentuk tubuh pasien. Metodenya dilakukan dengan memasukkan implan payudara berupa silikon atau saline implant melalui tindakan operasi.', 145000000.00),
(7, 'BEDAH', 'Fat Transfer', 'prosedur untuk memindahkan lemak dari bagian tubuh tertentu ke area yang membutuhkan tambahan volume, termasuk wajah. Tujuannya mengembalikan volume yang berkurang, memperbaiki kontur, menghaluskan tampilan kerutan, dan memberikan hasil yang lebih natural karena menggunakan lemak tubuh pasien sendiri. Metodenya dilakukan dengan mengambil lemak menggunakan teknik liposuction, memproses lemak tersebut, kemudian menyuntikkannya ke area tujuan seperti pipi, bawah mata, atau dagu.', 70000000.00),
(8, 'BEDAH', 'Filler Dagu', 'tindakan non-bedah untuk memperbaiki kontur dan definisi dagu dengan menggunakan bahan filler yang disuntikkan ke jaringan lunak di bawah kulit. Tujuannya membuat dagu terlihat lebih tegas, proporsional, atau membantu membentuk garis rahang sehingga proporsi wajah menjadi lebih seimbang. Metodenya dilakukan melalui penyuntikan filler pada area dagu sesuai bentuk dan kebutuhan wajah pasien.', 45000000.00),
(9, 'BEDAH', 'Filler Hidung', 'prosedur non-bedah untuk memperbaiki bentuk dan kontur hidung menggunakan filler. Tujuannya memberikan perubahan bentuk hidung secara sementara, misalnya membuat batang hidung terlihat lebih lurus atau lebih terdefinisi, sebagai alternatif bagi pasien yang belum ingin menjalani operasi rhinoplasty. Metodenya dilakukan dengan menyuntikkan filler pada titik tertentu di hidung untuk membentuk kontur yang diinginkan.', 50000000.00),
(10, 'BEDAH', 'Botox Dahi', 'tindakan penyuntikan botulinum toxin pada otot-otot dahi yang aktif berkontraksi. Tujuannya mengurangi tampilan garis atau kerutan dinamis pada dahi sehingga kulit terlihat lebih halus. Metodenya dilakukan dengan menyuntikkan botulinum toxin pada titik-titik otot tertentu sehingga aktivitas kontraksi otot berkurang untuk sementara.', 25000000.00),
(11, 'BEDAH', 'Botox Area Mata', 'tindakan penyuntikan botulinum toxin pada otot di sekitar mata, terutama untuk membantu mengurangi garis atau kerutan yang muncul ketika tersenyum atau menyipitkan mata. Tujuannya membuat area sekitar mata terlihat lebih halus dan segar. Metodenya dilakukan dengan menyuntikkan botulinum toxin dalam dosis tertentu pada otot target di sekitar area mata. Beyoutiful mencantumkan Botox dahi dan sudut mata sebagai salah satu perawatan area wajahnya.', 22000000.00),
(12, 'BEDAH', 'Botox Rahang', 'tindakan penyuntikan botulinum toxin pada otot masseter atau otot pengunyahan di area rahang. Tujuannya membantu membuat rahang terlihat lebih ramping, tirus, dan terdefinisi, terutama pada wajah yang tampak lebar karena ukuran otot rahang yang besar. Metodenya dilakukan dengan menyuntikkan botulinum toxin pada beberapa titik otot rahang sehingga aktivitas dan ukuran otot berkurang secara bertahap.', 27500000.00),
(13, 'TREATMENT', 'T-rejuv', 'treatment rejuvenasi kulit yang diformulasikan untuk membantu memperbaiki tanda-tanda penuaan dan kualitas kulit. Tujuannya membantu mengurangi garis halus dan kerutan, mengecilkan tampilan pori-pori, serta memberikan tampilan kulit yang lebih glowing, sehat, dan segar. Metodenya merupakan treatment injeksi menggunakan formulasi khusus yang digunakan untuk proses rejuvenasi kulit.', 6000000.00),
(14, 'TREATMENT', 'T-Plasma', 'treatment yang memanfaatkan darah pasien sendiri untuk menghasilkan serum yang digunakan dalam perawatan kulit. Tujuannya membantu menyehatkan kulit, meningkatkan regenerasi sel, membuat kulit lebih kencang, serta membantu meratakan warna kulit. Metodenya dilakukan dengan mengambil darah pasien, mengolahnya untuk mendapatkan serum yang dibutuhkan, kemudian menggunakannya pada area kulit yang ditargetkan.', 6000000.00),
(15, 'TREATMENT', 'T-Silk', 'treatment perawatan kulit yang ditujukan untuk membersihkan dan memperbaiki kondisi permukaan kulit. Tujuannya mengangkat sel kulit mati, memberikan nutrisi pada kulit, serta membantu mengatasi masalah seperti jerawat dan pori-pori yang tersumbat. Metodenya dilakukan dengan proses eksfoliasi dan pemberian serum untuk membantu membersihkan sekaligus menutrisi kulit.', 4500000.00),
(16, 'TREATMENT', 'T-Flex', 'treatment yang ditujukan untuk membantu mengatasi flek dan melasma pada kulit. Tujuannya mengurangi tampilan pigmentasi atau noda gelap sehingga warna kulit terlihat lebih merata. Metodenya dilakukan melalui injeksi menggunakan formulasi khusus untuk menangani masalah flek dan melasma.', 6000000.00),
(17, 'TREATMENT', 'Hifu', 'treatment non-invasif yang menggunakan energi ultrasound terfokus untuk membantu mengencangkan kulit. Tujuannya mengurangi tampilan kerutan, membantu memperbaiki kontur wajah, mengecilkan tampilan pori-pori, serta membantu membentuk garis wajah seperti V-line dan memperbaiki area jowell. Metodenya dilakukan dengan menghantarkan energi ultrasound terfokus ke lapisan jaringan tertentu tanpa melakukan sayatan pada kulit.', 12000000.00),
(18, 'TREATMENT', 'T-Peeling', 'prosedur eksfoliasi menggunakan peeling untuk mengangkat lapisan sel kulit mati dan membantu mempercepat pembaruan sel kulit. Tujuannya membuat kulit terlihat lebih halus, cerah, dan kencang serta membantu memperbaiki kondisi permukaan kulit. Metodenya dilakukan dengan mengaplikasikan bahan peeling pada area kulit yang ditargetkan dalam konsentrasi dan waktu tertentu; treatment ini dapat dilakukan pada wajah, ketiak, dan lipatan paha.', 10000000.00),
(19, 'TREATMENT', 'RF', 'treatment non-invasif yang menggunakan energi radiofrequency atau gelombang elektromagnetik untuk menghasilkan panas terkontrol pada jaringan kulit. Tujuannya membantu mengencangkan kulit wajah dan meningkatkan kualitas serta elastisitas kulit. Metodenya dilakukan dengan menggunakan alat RF yang menghantarkan energi ke area wajah sehingga memberikan efek pemanasan terkontrol pada jaringan.', 8000000.00),
(20, 'KONSULTASI', 'Konsultasi', 'sesi pemeriksaan dan diskusi dengan dokter untuk mengetahui kondisi, keluhan, kebutuhan, serta tujuan estetika pasien. Tujuannya menentukan tindakan atau kombinasi treatment yang paling sesuai dengan kondisi pasien. Metodenya dilakukan melalui anamnesis, pemeriksaan kondisi wajah atau tubuh, evaluasi kebutuhan pasien, serta penjelasan mengenai pilihan tindakan, manfaat, risiko, dan proses perawatan.', 600000.00),
(21, 'KONTROL', 'Kontrol', 'kunjungan pemeriksaan setelah pasien menjalani tindakan atau treatment. Tujuannya memantau proses pemulihan dan perkembangan hasil tindakan serta memastikan kondisi pasien berjalan sesuai dengan rencana perawatan. Metodenya dilakukan melalui pemeriksaan langsung oleh dokter dan evaluasi kondisi area yang telah mendapatkan tindakan, kemudian diberikan instruksi atau perawatan lanjutan apabila diperlukan.', 600000.00),
(22, 'BEDAH', 'Liposuction', 'prosedur bedah untuk menghilangkan timbunan lemak pada area tubuh tertentu sekaligus membentuk kontur tubuh. Tujuannya mengurangi lemak lokal yang sulit hilang dengan diet atau olahraga dan menghasilkan bentuk tubuh yang lebih proporsional. Metodenya dilakukan dengan teknik penyedotan lemak menggunakan kanula melalui sayatan kecil pada area yang ditargetkan, seperti perut, pinggul, paha, bokong, lengan, atau leher. Beyoutiful juga menjelaskan liposuction sebagai prosedur untuk menghilangkan lemak sekaligus membentuk kontur tubuh.', 150000000.00),
(23, 'BEDAH', 'Necklift', 'prosedur bedah untuk memperbaiki kulit dan jaringan leher yang kendur serta mempertegas kontur antara wajah dan leher. Tujuannya membuat leher terlihat lebih kencang dan garis rahang lebih terdefinisi. Metodenya dilakukan dengan mengangkat dan mengencangkan jaringan leher serta menyesuaikan kulit yang berlebih melalui tindakan pembedahan sesuai kondisi pasien.', 120000000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `payroll_detail`
--

CREATE TABLE `payroll_detail` (
  `id` int(11) NOT NULL,
  `payroll_periode_id` int(11) NOT NULL,
  `pegawai_id` int(11) DEFAULT NULL,
  `pegawai_tipe` varchar(50) DEFAULT NULL,
  `nik` varchar(50) NOT NULL,
  `nama_karyawan` varchar(100) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `gaji_pokok` decimal(15,2) DEFAULT 0.00,
  `tunjangan_jabatan` decimal(15,2) DEFAULT 0.00,
  `fee_tindakan` decimal(15,2) DEFAULT 0.00,
  `lembur` decimal(15,2) DEFAULT 0.00,
  `pendapatan_kotor` decimal(15,2) DEFAULT 0.00,
  `potongan_bpjs_kes` decimal(15,2) DEFAULT 0.00,
  `potongan_bpjs_tk` decimal(15,2) DEFAULT 0.00,
  `potongan_pph21` decimal(15,2) DEFAULT 0.00,
  `total_potongan` decimal(15,2) DEFAULT 0.00,
  `take_home_pay` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payroll_detail`
--

INSERT INTO `payroll_detail` (`id`, `payroll_periode_id`, `pegawai_id`, `pegawai_tipe`, `nik`, `nama_karyawan`, `jabatan`, `gaji_pokok`, `tunjangan_jabatan`, `fee_tindakan`, `lembur`, `pendapatan_kotor`, `potongan_bpjs_kes`, `potongan_bpjs_tk`, `potongan_pph21`, `total_potongan`, `take_home_pay`) VALUES
(459, 1, 1, 'KARYAWAN', 'SMG00001', 'dr. Arti Indira, M.Gizi, Sp.GK, FINEM', 'Direktur Utama', 50000000.00, 2500000.00, 0.00, 0.00, 52500000.00, 120000.00, 332589.00, 9975000.00, 10427589.00, 42072411.00),
(460, 1, 2, 'KARYAWAN', 'SMG00002', 'Usman Ismail', 'Manager Operasional', 25000000.00, 1000000.00, 0.00, 0.00, 26000000.00, 120000.00, 332589.00, 2600000.00, 3052589.00, 22947411.00),
(461, 1, 3, 'KARYAWAN', 'SMG00005', 'Nur Abdi Yanto', 'Assisten Direktur', 15000000.00, 500000.00, 0.00, 0.00, 15500000.00, 120000.00, 332589.00, 1085000.00, 1537589.00, 13962411.00),
(462, 1, 4, 'KARYAWAN', 'SMG00007', 'Diana Marliana Sari', 'Asisten Manager Operasional', 10000000.00, 500000.00, 0.00, 0.00, 10500000.00, 100000.00, 300000.00, 262500.00, 662500.00, 9837500.00),
(463, 1, 5, 'KARYAWAN', 'SMG00008', 'M Fahmi Fauzy', 'Leader of Finance and Accounting', 11000000.00, 500000.00, 0.00, 0.00, 11500000.00, 110000.00, 330000.00, 402500.00, 842500.00, 10657500.00),
(464, 1, 6, 'KARYAWAN', 'SMG00009', 'Silvia Indah', 'Finance', 7500000.00, 500000.00, 0.00, 0.00, 8000000.00, 75000.00, 225000.00, 120000.00, 420000.00, 7580000.00),
(465, 1, 7, 'KARYAWAN', 'SMG00010', 'Debby', 'Accounting', 8000000.00, 500000.00, 0.00, 0.00, 8500000.00, 80000.00, 240000.00, 127500.00, 447500.00, 8052500.00),
(466, 1, 8, 'KARYAWAN', 'SMG00011', 'Ferdiyanto', 'Office Boy', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(467, 1, 9, 'KARYAWAN', 'SMG00013', 'Dolly Febrizio', 'Office Boy', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(468, 1, 10, 'KARYAWAN', 'SMG00014', 'Adi Supratman', 'Leader Of Office Boy and Office Girl', 6000000.00, 500000.00, 0.00, 0.00, 6500000.00, 60000.00, 180000.00, 65000.00, 305000.00, 6195000.00),
(469, 1, 11, 'KARYAWAN', 'SMG00015', 'Ratna', 'Juru Masak', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(470, 1, 12, 'KARYAWAN', 'SMG00018', 'Surtinah', 'Office Girl', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(471, 1, 13, 'KARYAWAN', 'SMG00019', 'Septiani', 'Office Girl', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(472, 1, 14, 'KARYAWAN', 'SMG00023', 'Diah Permata Sari', 'Admin/Kasir', 4800000.00, 500000.00, 0.00, 0.00, 5300000.00, 48000.00, 144000.00, 0.00, 192000.00, 5108000.00),
(473, 1, 15, 'KARYAWAN', 'SMG00024', 'Desti', 'Admin/Kasir', 4800000.00, 500000.00, 0.00, 0.00, 5300000.00, 48000.00, 144000.00, 0.00, 192000.00, 5108000.00),
(474, 1, 16, 'KARYAWAN', 'SMG00026', 'Ridho Pratama', 'Accounting', 7000000.00, 500000.00, 0.00, 0.00, 7500000.00, 70000.00, 210000.00, 93750.00, 373750.00, 7126250.00),
(475, 1, 17, 'KARYAWAN', 'SMG00027', 'Marlina', 'Admin/Kasir', 4800000.00, 500000.00, 0.00, 0.00, 5300000.00, 48000.00, 144000.00, 0.00, 192000.00, 5108000.00),
(476, 1, 18, 'KARYAWAN', 'SMG00028', 'Anugrah', 'Office Boy', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(477, 1, 19, 'KARYAWAN', 'SMG00029', 'Dwi Lestari', 'Office Girl', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(478, 1, 20, 'KARYAWAN', 'SMG00030', 'Sasa Kumala', 'Finance', 6500000.00, 500000.00, 0.00, 0.00, 7000000.00, 65000.00, 195000.00, 87500.00, 347500.00, 6652500.00),
(479, 1, 21, 'KARYAWAN', 'SMG00031', 'Sutanto', 'Leader of HRGA', 12500000.00, 500000.00, 0.00, 0.00, 13000000.00, 120000.00, 332589.00, 650000.00, 1102589.00, 11897411.00),
(480, 1, 22, 'KARYAWAN', 'SMG00032', 'Rindu', 'HR', 8000000.00, 500000.00, 0.00, 0.00, 8500000.00, 80000.00, 240000.00, 127500.00, 447500.00, 8052500.00),
(481, 1, 23, 'KARYAWAN', 'SMG00033', 'Aziz', 'GA', 7500000.00, 500000.00, 0.00, 0.00, 8000000.00, 75000.00, 225000.00, 120000.00, 420000.00, 7580000.00),
(482, 1, 24, 'KARYAWAN', 'SMG00034', 'Budi', 'Office Boy', 4000000.00, 500000.00, 0.00, 0.00, 4500000.00, 40000.00, 120000.00, 0.00, 160000.00, 4340000.00),
(483, 1, 1, 'SUSTER', 'SMG00003', 'Maria Kristine', 'Suster - OPERASI', 5500000.00, 300000.00, 75000.00, 0.00, 5875000.00, 55000.00, 165000.00, 29000.00, 249000.00, 5626000.00),
(484, 1, 2, 'SUSTER', 'SMG00004', 'Helen', 'Suster - OPERASI', 5500000.00, 300000.00, 75000.00, 0.00, 5875000.00, 55000.00, 165000.00, 29000.00, 249000.00, 5626000.00),
(485, 1, 3, 'SUSTER', 'SMG00006', 'Septya Laili', 'Suster - OPERASI', 5500000.00, 300000.00, 75000.00, 0.00, 5875000.00, 55000.00, 165000.00, 29000.00, 249000.00, 5626000.00),
(486, 1, 4, 'SUSTER', 'SMG00016', 'Dian Pertiwi', 'Suster - OPERASI', 5000000.00, 300000.00, 0.00, 0.00, 5300000.00, 50000.00, 150000.00, 0.00, 200000.00, 5100000.00),
(487, 1, 5, 'SUSTER', 'SMG00025', 'Safira', 'Suster - OPERASI', 4500000.00, 300000.00, 0.00, 0.00, 4800000.00, 45000.00, 135000.00, 0.00, 180000.00, 4620000.00),
(488, 1, 6, 'SUSTER', 'SMG00020', 'Dewi', 'Suster - JAGA', 5000000.00, 300000.00, 25000.00, 0.00, 5325000.00, 50000.00, 150000.00, 0.00, 200000.00, 5125000.00),
(489, 1, 7, 'SUSTER', 'SMG00012', 'Uli Pandjaitan', 'Suster - JAGA', 4500000.00, 300000.00, 25000.00, 0.00, 4825000.00, 45000.00, 135000.00, 0.00, 180000.00, 4645000.00),
(490, 1, 8, 'SUSTER', 'SMG00017', 'Vanda Agustina', 'Suster - TREATMENT', 5000000.00, 300000.00, 0.00, 0.00, 5300000.00, 50000.00, 150000.00, 0.00, 200000.00, 5100000.00),
(491, 1, 9, 'SUSTER', 'SMG00022', 'Rena Safitri', 'Suster - TREATMENT', 5000000.00, 300000.00, 0.00, 0.00, 5300000.00, 50000.00, 150000.00, 0.00, 200000.00, 5100000.00),
(492, 1, 10, 'SUSTER', 'SMG00021', 'Octa Nuraini', 'Suster - TREATMENT', 4500000.00, 300000.00, 0.00, 0.00, 4800000.00, 45000.00, 135000.00, 0.00, 180000.00, 4620000.00),
(493, 1, 1, 'DOKTER', '-', 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter - BEDAH', 0.00, 0.00, 54127500.00, 0.00, 54127500.00, 0.00, 0.00, 1353188.00, 1353188.00, 52774312.00),
(494, 1, 2, 'DOKTER', '-', 'dr. Hendra T Hartono, SpBP-RE', 'Dokter - BEDAH', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
(495, 1, 3, 'DOKTER', '-', 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter - BEDAH', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
(496, 1, 4, 'DOKTER', '-', 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter - BEDAH', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
(497, 1, 5, 'DOKTER', '-', 'dr. Laurent L Supit, Sp.BP-RE', 'Dokter - BEDAH', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
(498, 1, 6, 'DOKTER', '-', 'dr. Catharina Ari Wilandani, Sp.D.V.E, FINSDV', 'Dokter - TREATMENT', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
(499, 1, 7, 'DOKTER', '-', 'dr. Marsha Bianti, Sp.DVE', 'Dokter - TREATMENT', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
(500, 1, 8, 'DOKTER', '-', 'dr. Danar Wicaksono, Sp.DVE', 'Dokter - TREATMENT', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
(501, 1, 9, 'DOKTER', '-', 'dr. Betardi Aktara, Sp.An', 'Dokter - ANESTESI', 0.00, 0.00, 10000000.00, 0.00, 10000000.00, 0.00, 0.00, 250000.00, 250000.00, 9750000.00),
(502, 1, 10, 'DOKTER', '-', 'dr. Michael Mandagi, Sp.An', 'Dokter - ANESTESI', 0.00, 0.00, 10000000.00, 0.00, 10000000.00, 0.00, 0.00, 250000.00, 250000.00, 9750000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `payroll_periode`
--

CREATE TABLE `payroll_periode` (
  `id` int(11) NOT NULL,
  `bulan` int(11) NOT NULL,
  `tahun` int(11) NOT NULL,
  `tanggal_proses` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'LOCKED'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payroll_periode`
--

INSERT INTO `payroll_periode` (`id`, `bulan`, `tahun`, `tanggal_proses`, `status`) VALUES
(1, 9, 2026, '2026-10-16 15:52:37', 'OPEN');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi_fee_detail`
--

CREATE TABLE `transaksi_fee_detail` (
  `id` int(11) NOT NULL,
  `transaksi_id` int(11) NOT NULL,
  `tanggal_tindakan` date NOT NULL,
  `pegawai_tipe` enum('DOKTER','SUSTER') NOT NULL,
  `pegawai_id` int(11) NOT NULL,
  `nama_pegawai` varchar(100) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `fee_nominal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi_fee_detail`
--

INSERT INTO `transaksi_fee_detail` (`id`, `transaksi_id`, `tanggal_tindakan`, `pegawai_tipe`, `pegawai_id`, `nama_pegawai`, `jabatan`, `fee_nominal`, `created_at`) VALUES
(1, 52, '2026-09-01', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-16 18:49:28'),
(3, 54, '2026-10-03', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-16 18:49:28'),
(12, 55, '2026-09-01', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Utama', 420000.00, '2026-10-17 13:51:10'),
(13, 58, '2026-09-02', 'DOKTER', 3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 13:52:47'),
(22, 61, '2026-09-03', 'DOKTER', 4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 13:54:05'),
(59, 69, '2026-09-14', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 13:59:42'),
(66, 68, '2026-09-07', 'DOKTER', 8, 'dr. Danar Wicaksono, Sp.DVE', 'Dokter Utama', 6265000.00, '2026-10-17 14:01:43'),
(67, 68, '2026-09-07', 'SUSTER', 10, 'Octa Nuraini', 'Suster - OPERASI', 50000.00, '2026-10-17 14:01:43'),
(68, 67, '2026-09-07', 'DOKTER', 7, 'dr. Marsha Bianti, Sp.DVE', 'Dokter Utama', 3745000.00, '2026-10-17 14:02:01'),
(69, 67, '2026-09-07', 'SUSTER', 9, 'Rena Safitri', 'Suster - OPERASI', 50000.00, '2026-10-17 14:02:01'),
(70, 66, '2026-09-06', 'DOKTER', 6, 'dr. Catharina Ari Wilandani, Sp.D.V.E, FINSDV', 'Dokter Utama', 3745000.00, '2026-10-17 14:02:13'),
(71, 66, '2026-09-06', 'SUSTER', 8, 'Vanda Agustina', 'Suster - OPERASI', 50000.00, '2026-10-17 14:02:13'),
(72, 72, '2026-09-15', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:02:38'),
(73, 75, '2026-09-16', 'DOKTER', 3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:02:45'),
(81, 78, '2026-09-17', 'DOKTER', 4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:03:46'),
(94, 73, '2026-09-17', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Utama', 11513250.00, '2026-10-17 14:05:53'),
(95, 73, '2026-09-17', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Pendukung', 11513250.00, '2026-10-17 14:05:53'),
(96, 73, '2026-09-17', 'SUSTER', 2, 'Helen', 'Suster - OPERASI', 75000.00, '2026-10-17 14:05:53'),
(97, 73, '2026-09-17', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 5000000.00, '2026-10-17 14:05:53'),
(98, 73, '2026-09-17', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 5000000.00, '2026-10-17 14:05:53'),
(99, 73, '2026-09-17', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:05:53'),
(100, 73, '2026-09-17', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:05:53'),
(101, 70, '2026-09-15', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 19876500.00, '2026-10-17 14:06:05'),
(102, 70, '2026-09-15', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:05'),
(103, 70, '2026-09-15', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 5000000.00, '2026-10-17 14:06:05'),
(104, 70, '2026-09-15', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 5000000.00, '2026-10-17 14:06:05'),
(105, 70, '2026-09-15', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:05'),
(106, 70, '2026-09-15', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:05'),
(107, 62, '2026-09-05', 'DOKTER', 4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter Utama', 57523550.00, '2026-10-17 14:06:31'),
(108, 62, '2026-09-05', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Pendukung', 24652950.00, '2026-10-17 14:06:31'),
(109, 62, '2026-09-05', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:31'),
(110, 62, '2026-09-05', 'SUSTER', 4, 'Dian Pertiwi', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:31'),
(111, 62, '2026-09-05', 'SUSTER', 5, 'Safira', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:31'),
(112, 62, '2026-09-05', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:31'),
(113, 62, '2026-09-05', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:31'),
(114, 62, '2026-09-05', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:31'),
(115, 62, '2026-09-05', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:31'),
(116, 64, '2026-09-04', 'DOKTER', 5, 'dr. Laurent L Supit, Sp.BP-RE', 'Dokter Utama', 60826500.00, '2026-10-17 14:06:39'),
(117, 64, '2026-09-04', 'SUSTER', 5, 'Safira', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:39'),
(118, 64, '2026-09-04', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:39'),
(119, 64, '2026-09-04', 'SUSTER', 2, 'Helen', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:39'),
(120, 64, '2026-09-04', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:39'),
(121, 64, '2026-09-04', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:39'),
(122, 64, '2026-09-04', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:39'),
(123, 64, '2026-09-04', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:39'),
(124, 59, '2026-09-04', 'DOKTER', 3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter Utama', 34661200.00, '2026-10-17 14:06:47'),
(125, 59, '2026-09-04', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Pendukung', 8665300.00, '2026-10-17 14:06:47'),
(126, 59, '2026-09-04', 'SUSTER', 2, 'Helen', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:47'),
(127, 59, '2026-09-04', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:47'),
(128, 59, '2026-09-04', 'SUSTER', 4, 'Dian Pertiwi', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:47'),
(129, 59, '2026-09-04', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:47'),
(130, 59, '2026-09-04', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:47'),
(131, 59, '2026-09-04', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:47'),
(132, 59, '2026-09-04', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:47'),
(133, 56, '2026-09-03', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Utama', 69226500.00, '2026-10-17 14:06:59'),
(134, 56, '2026-09-03', 'SUSTER', 4, 'Dian Pertiwi', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:59'),
(135, 56, '2026-09-03', 'SUSTER', 5, 'Safira', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:59'),
(136, 56, '2026-09-03', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:06:59'),
(137, 56, '2026-09-03', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:59'),
(138, 56, '2026-09-03', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:06:59'),
(139, 56, '2026-09-03', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:59'),
(140, 56, '2026-09-03', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:06:59'),
(141, 53, '2026-09-02', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 53826500.00, '2026-10-17 14:07:10'),
(142, 53, '2026-09-02', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:07:10'),
(143, 53, '2026-09-02', 'SUSTER', 2, 'Helen', 'Suster - OPERASI', 75000.00, '2026-10-17 14:07:10'),
(144, 53, '2026-09-02', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:07:10'),
(145, 53, '2026-09-02', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:07:10'),
(146, 53, '2026-09-02', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:07:10'),
(147, 53, '2026-09-02', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:07:10'),
(148, 53, '2026-09-02', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:07:10'),
(149, 81, '2026-09-18', 'DOKTER', 5, 'dr. Laurent L Supit, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:07:18'),
(155, 76, '2026-09-18', 'DOKTER', 3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter Utama', 10776500.00, '2026-10-17 14:09:16'),
(156, 76, '2026-09-18', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:09:16'),
(157, 76, '2026-09-18', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 2500000.00, '2026-10-17 14:09:16'),
(158, 76, '2026-09-18', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 2500000.00, '2026-10-17 14:09:16'),
(159, 76, '2026-09-18', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:09:16'),
(160, 76, '2026-09-18', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:09:16'),
(161, 79, '2026-09-19', 'DOKTER', 4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter Utama', 8886500.00, '2026-10-17 14:09:44'),
(162, 79, '2026-09-19', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:09:44'),
(163, 79, '2026-09-19', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 2500000.00, '2026-10-17 14:09:44'),
(164, 79, '2026-09-19', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 2500000.00, '2026-10-17 14:09:44'),
(165, 79, '2026-09-19', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:09:44'),
(166, 79, '2026-09-19', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:09:44'),
(167, 82, '2026-09-21', 'DOKTER', 5, 'dr. Laurent L Supit, Sp.BP-RE', 'Dokter Utama', 12351500.00, '2026-10-17 14:10:51'),
(168, 82, '2026-09-21', 'SUSTER', 4, 'Dian Pertiwi', 'Suster - OPERASI', 75000.00, '2026-10-17 14:10:51'),
(169, 82, '2026-09-21', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 2500000.00, '2026-10-17 14:10:51'),
(170, 82, '2026-09-21', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 2500000.00, '2026-10-17 14:10:51'),
(171, 82, '2026-09-21', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:10:51'),
(172, 82, '2026-09-21', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:10:51'),
(173, 84, '2026-09-21', 'DOKTER', 6, 'dr. Catharina Ari Wilandani, Sp.D.V.E, FINSDV', 'Dokter Utama', 3745000.00, '2026-10-17 14:11:19'),
(174, 84, '2026-09-21', 'SUSTER', 8, 'Vanda Agustina', 'Suster - OPERASI', 50000.00, '2026-10-17 14:11:19'),
(175, 85, '2026-09-21', 'DOKTER', 7, 'dr. Marsha Bianti, Sp.DVE', 'Dokter Utama', 3745000.00, '2026-10-17 14:11:40'),
(176, 85, '2026-09-21', 'SUSTER', 9, 'Rena Safitri', 'Suster - OPERASI', 50000.00, '2026-10-17 14:11:40'),
(177, 86, '2026-09-22', 'DOKTER', 8, 'dr. Danar Wicaksono, Sp.DVE', 'Dokter Utama', 2800000.00, '2026-10-17 14:12:02'),
(178, 86, '2026-09-22', 'SUSTER', 10, 'Octa Nuraini', 'Suster - OPERASI', 50000.00, '2026-10-17 14:12:02'),
(179, 87, '2026-09-24', 'DOKTER', 6, 'dr. Catharina Ari Wilandani, Sp.D.V.E, FINSDV', 'Dokter Utama', 3745000.00, '2026-10-17 14:12:22'),
(180, 87, '2026-09-24', 'SUSTER', 8, 'Vanda Agustina', 'Suster - OPERASI', 50000.00, '2026-10-17 14:12:22'),
(181, 88, '2026-09-24', 'DOKTER', 7, 'dr. Marsha Bianti, Sp.DVE', 'Dokter Utama', 7525000.00, '2026-10-17 14:12:39'),
(182, 88, '2026-09-24', 'SUSTER', 9, 'Rena Safitri', 'Suster - OPERASI', 50000.00, '2026-10-17 14:12:39'),
(183, 89, '2026-09-26', 'DOKTER', 8, 'dr. Danar Wicaksono, Sp.DVE', 'Dokter Utama', 6265000.00, '2026-10-17 14:13:15'),
(184, 89, '2026-09-26', 'SUSTER', 10, 'Octa Nuraini', 'Suster - OPERASI', 50000.00, '2026-10-17 14:13:15'),
(185, 90, '2026-09-26', 'DOKTER', 8, 'dr. Danar Wicaksono, Sp.DVE', 'Dokter Utama', 6265000.00, '2026-10-17 14:13:34'),
(186, 90, '2026-09-26', 'SUSTER', 8, 'Vanda Agustina', 'Suster - OPERASI', 50000.00, '2026-10-17 14:13:34'),
(187, 91, '2026-09-28', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:13:40'),
(188, 92, '2026-09-29', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 72026500.00, '2026-10-17 14:14:22'),
(189, 92, '2026-09-29', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:14:22'),
(190, 92, '2026-09-29', 'SUSTER', 2, 'Helen', 'Suster - OPERASI', 75000.00, '2026-10-17 14:14:22'),
(191, 92, '2026-09-29', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:14:22'),
(192, 92, '2026-09-29', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:14:22'),
(193, 92, '2026-09-29', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:14:22'),
(194, 92, '2026-09-29', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:14:22'),
(195, 92, '2026-09-29', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:14:22'),
(196, 94, '2026-09-29', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:14:27'),
(197, 96, '2026-09-30', 'DOKTER', 3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:14:32'),
(198, 57, '2026-10-01', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:14:40'),
(199, 95, '2026-10-01', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Utama', 35228550.00, '2026-10-17 14:15:25'),
(200, 95, '2026-10-01', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Pendukung', 15097950.00, '2026-10-17 14:15:25'),
(201, 95, '2026-10-01', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:15:25'),
(202, 95, '2026-10-01', 'SUSTER', 2, 'Helen', 'Suster - OPERASI', 75000.00, '2026-10-17 14:15:25'),
(203, 95, '2026-10-01', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:15:25'),
(204, 95, '2026-10-01', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:15:25'),
(205, 95, '2026-10-01', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:15:25'),
(206, 95, '2026-10-01', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:15:25'),
(207, 95, '2026-10-01', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:15:25'),
(208, 100, '2026-10-01', 'DOKTER', 4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:15:31'),
(209, 101, '2026-10-01', 'DOKTER', 4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter Utama', 51195900.00, '2026-10-17 14:16:21'),
(210, 101, '2026-10-01', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Pendukung', 34130600.00, '2026-10-17 14:16:21'),
(211, 101, '2026-10-01', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:16:21'),
(212, 101, '2026-10-01', 'SUSTER', 2, 'Helen', 'Suster - OPERASI', 75000.00, '2026-10-17 14:16:21'),
(213, 101, '2026-10-01', 'SUSTER', 4, 'Dian Pertiwi', 'Suster - OPERASI', 75000.00, '2026-10-17 14:16:21'),
(214, 101, '2026-10-01', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:16:21'),
(215, 101, '2026-10-01', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:16:21'),
(216, 101, '2026-10-01', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:16:21'),
(217, 101, '2026-10-01', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:16:21'),
(218, 98, '2026-10-02', 'DOKTER', 3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter Utama', 55381200.00, '2026-10-17 14:17:10'),
(219, 98, '2026-10-02', 'DOKTER', 2, 'dr. Hendra T Hartono, SpBP-RE', 'Dokter Pendukung', 13845300.00, '2026-10-17 14:17:10'),
(220, 98, '2026-10-02', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:17:10'),
(221, 98, '2026-10-02', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:17:10'),
(222, 98, '2026-10-02', 'SUSTER', 5, 'Safira', 'Suster - OPERASI', 75000.00, '2026-10-17 14:17:10'),
(223, 98, '2026-10-02', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:17:10'),
(224, 98, '2026-10-02', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:17:10'),
(225, 98, '2026-10-02', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:17:10'),
(226, 98, '2026-10-02', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:17:10'),
(227, 65, '2026-10-05', 'DOKTER', 5, 'dr. Laurent L Supit, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:17:15'),
(228, 60, '2026-10-07', 'DOKTER', 3, 'dr. Patricia Marcellina Sadikin, BMedSc, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:17:19'),
(229, 63, '2026-10-08', 'DOKTER', 4, 'dr. Ruth Fitri Margareta Lumbuun, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:17:24'),
(230, 105, '2026-10-16', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 82526500.00, '2026-10-17 14:18:14'),
(231, 105, '2026-10-16', 'SUSTER', 3, 'Septya Laili', 'Suster - OPERASI', 75000.00, '2026-10-17 14:18:14'),
(232, 105, '2026-10-16', 'SUSTER', 1, 'Maria Kristine', 'Suster - OPERASI', 75000.00, '2026-10-17 14:18:14'),
(233, 105, '2026-10-16', 'SUSTER', 4, 'Dian Pertiwi', 'Suster - OPERASI', 75000.00, '2026-10-17 14:18:14'),
(234, 105, '2026-10-16', 'DOKTER', 9, 'dr. Betardi Aktara, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:18:14'),
(235, 105, '2026-10-16', 'DOKTER', 10, 'dr. Michael Mandagi, Sp.An', 'Dokter Anestesi', 10000000.00, '2026-10-17 14:18:15'),
(236, 105, '2026-10-16', 'SUSTER', 6, 'Dewi', 'Suster - JAGA', 15000.00, '2026-10-17 14:18:15'),
(237, 105, '2026-10-16', 'SUSTER', 7, 'Uli Pandjaitan', 'Suster - JAGA', 15000.00, '2026-10-17 14:18:15'),
(238, 71, '2026-10-17', 'DOKTER', 1, 'dr. Teuku Adifitrian, Sp.BP-RE', 'Dokter Utama', 420000.00, '2026-10-17 14:18:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi_medis`
--

CREATE TABLE `transaksi_medis` (
  `id` int(11) NOT NULL,
  `no_ktp` varchar(16) DEFAULT NULL,
  `nama_pasien` varchar(100) NOT NULL,
  `alamat_pasien` text DEFAULT NULL,
  `tanggal_booking` date DEFAULT NULL,
  `tanggal_tindakan` date NOT NULL,
  `jenis_tindakan` varchar(100) NOT NULL,
  `total_harga` decimal(15,2) NOT NULL,
  `diskon` decimal(15,2) DEFAULT 0.00,
  `total_nett` decimal(15,2) NOT NULL,
  `dp` decimal(15,2) DEFAULT 0.00,
  `pelunasan` decimal(15,2) DEFAULT 0.00,
  `sisa_bayar` decimal(15,2) DEFAULT 0.00,
  `status_pembayaran` enum('SCHEDULED','DP_PAID','LUNAS','CANCELLED') DEFAULT 'SCHEDULED',
  `status_finalisasi` enum('BELUM_LUNAS','SIAP_FINALISASI','DONE_FINALISASI') DEFAULT 'BELUM_LUNAS',
  `durasi_operasi_jam` int(11) DEFAULT 0,
  `jam_masuk_ok` time DEFAULT NULL,
  `jam_keluar_ok` time DEFAULT NULL,
  `dokter_id` int(11) DEFAULT NULL,
  `persen_dokter1` decimal(5,2) DEFAULT 100.00,
  `dokter2_id` int(11) DEFAULT NULL,
  `persen_dokter2` decimal(5,2) DEFAULT 0.00,
  `dokter_anestesi_id` int(11) DEFAULT NULL,
  `suster_op1_id` int(11) DEFAULT NULL,
  `suster_op2_id` int(11) DEFAULT NULL,
  `suster_op3_id` int(11) DEFAULT NULL,
  `suster_rawat_id` int(11) DEFAULT NULL,
  `tipe_anestesi` enum('FULL','SETENGAH','LOKAL','NONE') DEFAULT 'NONE',
  `biaya_anestesi` decimal(15,2) DEFAULT 0.00,
  `durasi_ok` decimal(5,2) DEFAULT 0.00,
  `tarif_ok_per_jam` decimal(15,2) DEFAULT 0.00,
  `biaya_ruang_operasi` decimal(15,2) DEFAULT 0.00,
  `biaya_suster_op` decimal(15,2) DEFAULT 0.00,
  `biaya_suster_rawat` decimal(15,2) DEFAULT 0.00,
  `biaya_obat` decimal(15,2) DEFAULT 0.00,
  `sisa_pembagian` decimal(15,2) DEFAULT 0.00,
  `bagian_rs_30` decimal(15,2) DEFAULT 0.00,
  `fee_dokter1` decimal(15,2) DEFAULT 0.00,
  `fee_dokter2` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `bagian_dokter_70` decimal(15,2) DEFAULT 0.00,
  `bagian_suster` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi_medis`
--

INSERT INTO `transaksi_medis` (`id`, `no_ktp`, `nama_pasien`, `alamat_pasien`, `tanggal_booking`, `tanggal_tindakan`, `jenis_tindakan`, `total_harga`, `diskon`, `total_nett`, `dp`, `pelunasan`, `sisa_bayar`, `status_pembayaran`, `status_finalisasi`, `durasi_operasi_jam`, `jam_masuk_ok`, `jam_keluar_ok`, `dokter_id`, `persen_dokter1`, `dokter2_id`, `persen_dokter2`, `dokter_anestesi_id`, `suster_op1_id`, `suster_op2_id`, `suster_op3_id`, `suster_rawat_id`, `tipe_anestesi`, `biaya_anestesi`, `durasi_ok`, `tarif_ok_per_jam`, `biaya_ruang_operasi`, `biaya_suster_op`, `biaya_suster_rawat`, `biaya_obat`, `sisa_pembagian`, `bagian_rs_30`, `fee_dokter1`, `fee_dokter2`, `created_at`, `bagian_dokter_70`, `bagian_suster`) VALUES
(52, '0000000000000001', 'SUSI SUSANTI', 'JAKARTA', '2026-09-01', '2026-09-01', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 600000.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:02:38', 0.00, 0.00),
(53, '0000000000000001', 'SUSI SUSANTI', 'JAKARTA', '2026-09-01', '2026-09-02', 'Breast Augmentation', 145000000.00, 0.00, 145000000.00, 0.00, 145000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, 9, 1, 2, 3, 6, '', 20000000.00, 2.00, 4000000.00, 8000000.00, 75000.00, 30000.00, 40000000.00, 76725000.00, 23068500.00, 53826500.00, 0.00, '2026-10-14 07:03:58', 53826500.00, 0.00),
(54, '0000000000000001', 'SUSI SUSANTI', 'JAKARTA', '2026-09-01', '2026-10-03', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 600000.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:06:10', 0.00, 0.00),
(55, '0000000000000002', 'SANTI WIJAYA', '', '2026-09-01', '2026-09-01', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 2, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:10:27', 420000.00, 0.00),
(56, '0000000000000002', 'SANTI WIJAYA', 'TANGERANG', '2026-09-01', '2026-09-03', 'Facelift', 150000000.00, 0.00, 150000000.00, 0.00, 150000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 2, 100.00, NULL, 0.00, 10, 4, 5, 1, 6, '', 20000000.00, 4.00, 4000000.00, 16000000.00, 75000.00, 30000.00, 15000000.00, 0.00, 29668500.00, 69226500.00, 0.00, '2026-10-14 07:11:13', 69226500.00, 0.00),
(57, '0000000000000002', 'SANTI WIJAYA', 'TANGERANG', '2026-09-03', '2026-10-01', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 2, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:12:19', 420000.00, 0.00),
(58, '0000000000000003', 'SISKA', 'JAKARTA', '2026-09-02', '2026-09-02', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 3, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:13:09', 420000.00, 0.00),
(59, '0000000000000003', 'SISKA', 'JAKARTA', '2026-09-01', '2026-09-04', 'Mid Facelift', 100000000.00, 0.00, 100000000.00, 0.00, 100000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 3, 80.00, 1, 20.00, 9, 2, 3, 4, 7, '', 20000000.00, 2.00, 4000000.00, 8000000.00, 75000.00, 30000.00, 10000000.00, 0.00, 18568500.00, 34661200.00, 8665300.00, '2026-10-14 07:14:25', 43326500.00, 0.00),
(60, '0000000000000003', 'SISKA', 'TANGERANG', '2026-09-04', '2026-10-07', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 3, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:15:12', 420000.00, 0.00),
(61, '0000000000000004', 'TUTI', 'JAKARTA', '2026-09-01', '2026-09-03', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 4, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:17:35', 420000.00, 0.00),
(62, '0000000000000004', 'TUTI', 'JAKARTA', '2026-09-01', '2026-09-05', 'Blepharoplasty', 175000000.00, 0.00, 175000000.00, 0.00, 175000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 4, 70.00, 2, 30.00, 9, 3, 4, 5, 7, '', 20000000.00, 5.00, 4000000.00, 20000000.00, 75000.00, 30000.00, 17500000.00, 0.00, 35218500.00, 57523550.00, 24652950.00, '2026-10-14 07:18:45', 82176500.00, 0.00),
(63, '0000000000000004', 'TUTI', 'JAKARTA', '2026-09-05', '2026-10-08', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 4, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:19:29', 420000.00, 0.00),
(64, '0000000000000005', 'SISI PRICILIA', 'JAKARTA', '2026-09-01', '2026-09-04', 'Breast Augmentation', 145000000.00, 0.00, 145000000.00, 0.00, 145000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 5, 100.00, NULL, 0.00, 10, 5, 1, 2, 6, '', 20000000.00, 2.00, 4000000.00, 8000000.00, 75000.00, 30000.00, 30000000.00, 0.00, 26068500.00, 60826500.00, 0.00, '2026-10-14 07:20:13', 60826500.00, 0.00),
(65, '0000000000000005', 'SISI PRICILIA', 'JAKARTA', '2026-09-04', '2026-10-05', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 5, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:22:22', 420000.00, 0.00),
(66, '0000000000000022', 'DIDI RIYADI', 'JAKARTA', '2026-09-06', '2026-09-06', 'T-rejuv', 6000000.00, 0.00, 6000000.00, 0.00, 6000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 6, 100.00, NULL, 0.00, NULL, 8, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 600000.00, 0.00, 1605000.00, 3745000.00, 0.00, '2026-10-14 07:23:35', 3745000.00, 0.00),
(67, '0000000000000006', 'DEDI MAHENDRA DESTA', 'JAKARTA', '2026-09-07', '2026-09-07', 'T-Plasma', 6000000.00, 0.00, 6000000.00, 0.00, 6000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 7, 100.00, NULL, 0.00, NULL, 9, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 600000.00, 0.00, 1605000.00, 3745000.00, 0.00, '2026-10-14 07:25:35', 3745000.00, 0.00),
(68, '0000000000000023', 'VINCENT', 'JAKARTA', '2026-08-31', '2026-09-07', 'T-Peeling', 10000000.00, 0.00, 10000000.00, 0.00, 10000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 8, 100.00, NULL, 0.00, NULL, 10, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 1000000.00, 0.00, 2685000.00, 6265000.00, 0.00, '2026-10-14 07:26:25', 6265000.00, 0.00),
(69, '0000000000000007', 'MELLY', 'BANDUNG', '2026-09-14', '2026-09-14', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-14 07:27:54', 420000.00, 0.00),
(70, '0000000000000007', 'MELLY', 'BANDUNG', '2026-09-14', '2026-09-15', 'Filler Dagu', 45000000.00, 0.00, 45000000.00, 0.00, 45000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, 9, 1, NULL, NULL, NULL, '', 10000000.00, 1.00, 2000000.00, 2000000.00, 75000.00, 30000.00, 4500000.00, 0.00, 8518500.00, 19876500.00, 0.00, '2026-10-14 07:28:35', 19876500.00, 0.00),
(71, '0000000000000007', 'MELLY', 'BANDUNG', '2026-09-15', '2026-10-17', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 16:18:29', 420000.00, 0.00),
(72, '0000000000000008', 'MAHALINI', 'JAKARTA', '2026-09-15', '2026-09-15', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 2, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 16:19:45', 420000.00, 0.00),
(73, '0000000000000008', 'MAHALINI', 'JAKARTA', '2026-09-15', '2026-09-17', 'Filler Hidung', 50000000.00, 0.00, 50000000.00, 0.00, 50000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 2, 50.00, 1, 50.00, 10, 2, NULL, NULL, 6, '', 10000000.00, 1.00, 2000000.00, 2000000.00, 75000.00, 30000.00, 5000000.00, 0.00, 9868500.00, 11513250.00, 11513250.00, '2026-10-15 16:20:54', 23026500.00, 0.00),
(74, '0000000000000008', 'MAHALINI', 'JAKARTA', '2026-09-17', '2026-10-20', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'SIAP_FINALISASI', 0, NULL, NULL, 2, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 16:26:19', 0.00, 0.00),
(75, '0000000000000009', 'AZIZAH', 'JAKARTA', '2026-09-16', '2026-09-16', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 3, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 16:27:43', 420000.00, 0.00),
(76, '0000000000000009', 'AZIZAH', 'JAKARTA', '2026-09-16', '2026-09-18', 'Botox Dahi', 25000000.00, 0.00, 25000000.00, 0.00, 25000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 3, 100.00, NULL, 0.00, 10, 3, NULL, NULL, 7, 'LOKAL', 5000000.00, 1.00, 2000000.00, 2000000.00, 75000.00, 30000.00, 2500000.00, 0.00, 4618500.00, 10776500.00, 0.00, '2026-10-15 16:28:45', 10776500.00, 0.00),
(77, '0000000000000009', 'AZIZAH', 'JAKARTA', '2026-09-18', '2026-10-21', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'SIAP_FINALISASI', 0, NULL, NULL, 3, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 16:32:44', 0.00, 0.00),
(78, '0000000000000010', 'ZEZE', 'SURABAYA', '2026-09-17', '2026-09-17', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 4, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 16:33:45', 420000.00, 0.00),
(79, '0000000000000010', 'ZEZE', 'SURABAYA', '2026-09-17', '2026-09-19', 'Botox Area Mata', 22000000.00, 0.00, 22000000.00, 0.00, 22000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 4, 100.00, NULL, 0.00, 10, 1, NULL, NULL, 6, 'LOKAL', 5000000.00, 1.00, 2000000.00, 2000000.00, 75000.00, 30000.00, 2200000.00, 0.00, 3808500.00, 8886500.00, 0.00, '2026-10-15 16:34:30', 8886500.00, 0.00),
(80, '0000000000000010', 'ZEZE', 'SURABAYA', '2026-09-19', '2026-10-22', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'SIAP_FINALISASI', 0, NULL, NULL, 4, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 16:35:56', 0.00, 0.00),
(81, '0000000000000011', 'BOWO', 'SEMARANG', '2026-09-18', '2026-09-18', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 5, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 16:37:43', 420000.00, 0.00),
(82, '0000000000000011', 'BOWO', 'SEMARANG', '2026-09-18', '2026-09-21', 'Botox Rahang', 27500000.00, 0.00, 27500000.00, 0.00, 27500000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 5, 100.00, NULL, 0.00, 10, 4, NULL, NULL, 6, 'LOKAL', 5000000.00, 1.00, 2000000.00, 2000000.00, 75000.00, 30000.00, 2750000.00, 0.00, 5293500.00, 12351500.00, 0.00, '2026-10-15 16:38:27', 12351500.00, 0.00),
(83, '0000000000000011', 'BOWO', 'SEMARANG', '2026-09-21', '2026-10-23', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'SIAP_FINALISASI', 0, NULL, NULL, 5, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 16:39:13', 0.00, 0.00),
(84, '0000000000000012', 'TANTRI', 'JAKARTA', '2026-09-21', '2026-09-21', 'T-rejuv', 6000000.00, 0.00, 6000000.00, 0.00, 6000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 6, 100.00, NULL, 0.00, NULL, 8, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 600000.00, 0.00, 1605000.00, 3745000.00, 0.00, '2026-10-15 16:42:26', 3745000.00, 0.00),
(85, '0000000000000013', 'CHUA', 'JAKARTA', '2026-09-15', '2026-09-21', 'T-Plasma', 6000000.00, 0.00, 6000000.00, 0.00, 6000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 7, 100.00, NULL, 0.00, NULL, 9, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 600000.00, 0.00, 1605000.00, 3745000.00, 0.00, '2026-10-15 16:43:17', 3745000.00, 0.00),
(86, '0000000000000014', 'CHANDRA', 'JOGJAKARTA', '2026-09-16', '2026-09-22', 'T-Silk', 4500000.00, 0.00, 4500000.00, 0.00, 4500000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 8, 100.00, NULL, 0.00, NULL, 10, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 450000.00, 0.00, 1200000.00, 2800000.00, 0.00, '2026-10-15 16:44:12', 2800000.00, 0.00),
(87, '0000000000000015', 'JOKO', 'SOLO', '2026-09-16', '2026-09-24', 'T-Flex', 6000000.00, 0.00, 6000000.00, 0.00, 6000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 6, 100.00, NULL, 0.00, NULL, 8, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 600000.00, 0.00, 1605000.00, 3745000.00, 0.00, '2026-10-15 16:46:27', 3745000.00, 0.00),
(88, '0000000000000021', 'RAKA', 'JAKARTA', '2026-09-14', '2026-09-24', 'Hifu', 12000000.00, 0.00, 12000000.00, 0.00, 12000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 7, 100.00, NULL, 0.00, NULL, 9, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 1200000.00, 0.00, 3225000.00, 7525000.00, 0.00, '2026-10-15 16:48:23', 7525000.00, 0.00),
(89, '0000000000000016', 'RANTI', 'JAKARTA', '2026-09-18', '2026-09-26', 'T-Peeling', 10000000.00, 0.00, 10000000.00, 0.00, 0.00, 0.00, 'CANCELLED', 'DONE_FINALISASI', 0, NULL, NULL, 8, 100.00, NULL, 0.00, NULL, 10, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 1000000.00, 0.00, 2685000.00, 6265000.00, 0.00, '2026-10-15 16:50:56', 6265000.00, 0.00),
(90, '0000000000000016', 'RANTI', 'JAKARTA', '2026-09-18', '2026-09-26', 'T-Peeling', 10000000.00, 0.00, 10000000.00, 0.00, 10000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 8, 100.00, NULL, 0.00, NULL, 8, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 50000.00, 0.00, 1000000.00, 0.00, 2685000.00, 6265000.00, 0.00, '2026-10-15 17:43:34', 6265000.00, 0.00),
(91, '0000000000000017', 'JANE', 'JAKARTA', '2026-09-21', '2026-09-28', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 18:07:13', 420000.00, 0.00),
(92, '0000000000000017', 'JANE', 'JAKARTA', '2026-09-28', '2026-09-29', 'Liposuction', 150000000.00, 0.00, 150000000.00, 0.00, 150000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, 10, 1, 2, 3, 7, '', 20000000.00, 3.00, 4000000.00, 12000000.00, 75000.00, 30000.00, 15000000.00, 0.00, 30868500.00, 72026500.00, 0.00, '2026-10-15 18:08:43', 72026500.00, 0.00),
(93, '0000000000000017', 'JANE', 'JAKARTA', '2026-09-29', '2026-10-31', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'SIAP_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 18:09:59', 0.00, 0.00),
(94, '0000000000000018', 'JUNIOR', 'BANDUNG', '2026-09-22', '2026-09-29', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 2, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 18:10:52', 420000.00, 0.00),
(95, '0000000000000018', 'JUNIOR', 'BANDUNG', '2026-09-29', '2026-10-01', 'Necklift', 120000000.00, 0.00, 120000000.00, 0.00, 120000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 2, 70.00, 1, 30.00, 10, 1, 2, 3, 6, '', 20000000.00, 4.00, 4000000.00, 16000000.00, 75000.00, 30000.00, 12000000.00, 0.00, 21568500.00, 35228550.00, 15097950.00, '2026-10-15 18:11:41', 50326500.00, 0.00),
(96, '0000000000000019', 'SALLY', 'BANJARNEGARA', '2026-09-21', '2026-09-30', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 3, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 18:12:49', 420000.00, 0.00),
(97, '0000000000000018', 'JUNIOR', 'BANDUNG', '2026-10-01', '2026-11-03', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'SIAP_FINALISASI', 0, NULL, NULL, 2, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 18:13:59', 0.00, 0.00),
(98, '0000000000000019', 'SALLY', 'BANJARNEGARA', '2026-09-30', '2026-10-02', 'Facelift', 150000000.00, 0.00, 150000000.00, 0.00, 150000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 3, 80.00, 2, 20.00, 10, 1, 3, 5, 6, '', 20000000.00, 4.00, 4000000.00, 16000000.00, 75000.00, 30000.00, 15000000.00, 0.00, 29668500.00, 55381200.00, 13845300.00, '2026-10-15 18:15:15', 69226500.00, 0.00),
(99, '0000000000000019', 'SALLY', 'BANJARNEGARA', '2026-10-02', '2026-11-04', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'SIAP_FINALISASI', 0, NULL, NULL, 3, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 18:15:59', 0.00, 0.00),
(100, '0000000000000020', 'JOANA', 'BANDUNG', '2026-09-24', '2026-10-01', 'Konsultasi', 600000.00, 0.00, 600000.00, 0.00, 600000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 4, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 180000.00, 420000.00, 0.00, '2026-10-15 18:24:45', 420000.00, 0.00),
(101, '0000000000000020', 'JOANA', 'BANDUNG', '2026-09-29', '2026-10-01', 'Rhinoplasty', 180000000.00, 0.00, 180000000.00, 0.00, 180000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 4, 60.00, 1, 40.00, 9, 1, 2, 4, 7, '', 20000000.00, 5.00, 4000000.00, 20000000.00, 75000.00, 30000.00, 18000000.00, 0.00, 36568500.00, 51195900.00, 34130600.00, '2026-10-15 18:25:30', 85326500.00, 0.00),
(102, '0000000000000020', 'JOANA', 'BANDUNG', '2026-10-03', '2026-11-05', 'Kontrol', 600000.00, 0.00, 600000.00, 0.00, 0.00, 600000.00, 'DP_PAID', 'BELUM_LUNAS', 0, NULL, NULL, 4, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 18:26:54', 0.00, 0.00),
(103, '0000000000000003', 'SISKA', 'JAKARTA', '2026-10-08', '2026-10-17', 'Breast Augmentation', 145000000.00, 0.00, 145000000.00, 45000000.00, 0.00, 100000000.00, 'DP_PAID', 'BELUM_LUNAS', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 18:37:44', 0.00, 0.00),
(104, '0000000000000002', 'SANTI WIJAYA', 'TANGERANG', '2026-10-15', '2026-10-24', 'Breast Augmentation', 145000000.00, 0.00, 145000000.00, 15000000.00, 0.00, 130000000.00, 'DP_PAID', 'BELUM_LUNAS', 0, NULL, NULL, 1, 100.00, NULL, 0.00, NULL, NULL, NULL, NULL, NULL, 'NONE', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2026-10-15 18:39:05', 0.00, 0.00),
(105, '0000000000000026', 'MARDIANA', 'JAKARTA', '2026-10-16', '2026-10-16', 'Rhinoplasty', 180000000.00, 0.00, 180000000.00, 0.00, 180000000.00, 0.00, 'LUNAS', 'DONE_FINALISASI', 0, NULL, NULL, 1, 100.00, NULL, 0.00, 9, 3, 1, 4, 6, '', 20000000.00, 6.00, 4000000.00, 24000000.00, 75000.00, 30000.00, 18000000.00, 0.00, 35368500.00, 82526500.00, 0.00, '2026-10-17 13:26:32', 82526500.00, 0.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `role` enum('pasien','admin','finance','administrator') NOT NULL DEFAULT 'pasien',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `username`, `password`, `no_hp`, `role`, `created_at`) VALUES
(1, 'Pasien Umum', 'pasien', '123456', NULL, 'pasien', '2026-10-06 04:54:41'),
(2, 'Admin Kasir', 'admin', '123456', NULL, 'admin', '2026-10-06 04:54:41'),
(3, 'Finance / Accounting', 'finance', '123456', NULL, 'finance', '2026-10-06 04:54:41'),
(4, 'Super Administrator', 'administrator', '123456', NULL, 'administrator', '2026-10-06 04:54:41'),
(5, 'Siska', 'Siska0102', '123456', '087712345678', 'pasien', '2026-10-07 09:57:29');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `master_dokter`
--
ALTER TABLE `master_dokter`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `master_karyawan`
--
ALTER TABLE `master_karyawan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik` (`nik`);

--
-- Indeks untuk tabel `master_lembur`
--
ALTER TABLE `master_lembur`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `master_suster`
--
ALTER TABLE `master_suster`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik` (`nik`);

--
-- Indeks untuk tabel `master_tindakan`
--
ALTER TABLE `master_tindakan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `payroll_detail`
--
ALTER TABLE `payroll_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payroll_periode_id` (`payroll_periode_id`);

--
-- Indeks untuk tabel `payroll_periode`
--
ALTER TABLE `payroll_periode`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaksi_fee_detail`
--
ALTER TABLE `transaksi_fee_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaksi_medis`
--
ALTER TABLE `transaksi_medis`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `master_dokter`
--
ALTER TABLE `master_dokter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `master_karyawan`
--
ALTER TABLE `master_karyawan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `master_lembur`
--
ALTER TABLE `master_lembur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `master_suster`
--
ALTER TABLE `master_suster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `master_tindakan`
--
ALTER TABLE `master_tindakan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT untuk tabel `payroll_detail`
--
ALTER TABLE `payroll_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=503;

--
-- AUTO_INCREMENT untuk tabel `payroll_periode`
--
ALTER TABLE `payroll_periode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `transaksi_fee_detail`
--
ALTER TABLE `transaksi_fee_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=239;

--
-- AUTO_INCREMENT untuk tabel `transaksi_medis`
--
ALTER TABLE `transaksi_medis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `payroll_detail`
--
ALTER TABLE `payroll_detail`
  ADD CONSTRAINT `payroll_detail_ibfk_1` FOREIGN KEY (`payroll_periode_id`) REFERENCES `payroll_periode` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
