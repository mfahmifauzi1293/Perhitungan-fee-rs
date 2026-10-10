const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Tambahkan session untuk menyimpan login user

const app = express();

// Konfigurasi Views dan Public Static Folder (Atur ke folder frontend)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend/views'));

app.use(express.static(path.join(__dirname, 'frontend/public')));
app.use('/image', express.static(path.join(__dirname, 'frontend/public/image')));

// Middleware Parser & Session
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'sakti-mandra-guna-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set true jika menggunakan HTTPS
}));

// Import All Routes dari Folder backend/routes
const indexRoutes = require('./backend/routes/indexRoutes'); // Ditambahkan
const authRoutes = require('./backend/routes/authRoutes');
const layananRoutes = require('./backend/routes/layananRoutes');
const dashboardRoutes = require('./backend/routes/dashboardRoutes');
const bookingRoutes = require('./backend/routes/bookingRoutes');
const finalisasiRoutes = require('./backend/routes/finalisasiRoutes');
const tindakanRoutes = require('./backend/routes/tindakanRoutes');
const dokterRoutes = require('./backend/routes/dokterRoutes');
const susterRoutes = require('./backend/routes/susterRoutes');
const laporanRoutes = require('./backend/routes/laporanRoutes');
const transaksiRoutes = require('./backend/routes/transaksiRoutes');
const pasienRoutes = require('./backend/routes/pasienRoutes');
const cekDokterRoutes = require('./backend/routes/cekDokterRoutes');

// Mount Routes
app.use('/', indexRoutes); // Ditambahkan agar GET / bisa dipanggil
app.use('/', authRoutes);
app.use('/', layananRoutes);
app.use('/', dashboardRoutes);
app.use('/', bookingRoutes);
app.use('/', finalisasiRoutes);
app.use('/', tindakanRoutes);
app.use('/', dokterRoutes);
app.use('/', susterRoutes);
app.use('/', laporanRoutes);
app.use('/', transaksiRoutes);
app.use('/', pasienRoutes);
app.use('/', cekDokterRoutes);

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running di http://localhost:${PORT}`));