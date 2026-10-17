// Import koneksi database MySQL
const db = require('../config/db'); 

// Render Halaman Login (Halaman Standalone jika diakses langsung)
exports.getLoginPage = (req, res) => {
  res.render('login', { role: req.query.role || null, error: null });
};

// Proses Login yang Mendukung AJAX / JSON Response untuk Pop-up Modal
exports.processLogin = async (req, res) => {
  const { username, password } = req.body;

  // Validasi input sederhana
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username dan kata sandi wajib diisi!'
    });
  }

  try {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1';
    
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Terjadi kesalahan pada sistem database: ' + err.message 
        });
      }

      if (results && results.length > 0) {
        const user = results[0];

        // Simpan data user ke dalam Session
        req.session.user = {
          id: user.id,
          nama: user.nama || user.username,
          username: user.username,
          role: user.role
        };

        // Tentukan URL pengarahan (redirect) berdasarkan role
        let redirectUrl = '/';
        switch (user.role) {
          case 'administrator':
          case 'admin':
          case 'finance':
          case 'kasir':
            redirectUrl = '/dashboard';
            break;
          case 'pasien':
            redirectUrl = '/booking';
            break;
          default:
            redirectUrl = '/';
            break;
        }

        return res.json({
          success: true,
          message: 'Login berhasil!',
          redirectUrl: redirectUrl
        });

      } else {
        return res.status(401).json({
          success: false,
          message: 'Username atau kata sandi yang Anda masukkan salah!'
        });
      }
    });

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan fatal pada server.' 
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout Error:', err);
    res.redirect('/');
  });
};