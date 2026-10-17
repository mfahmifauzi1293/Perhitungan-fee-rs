// Middleware untuk memeriksa hak akses berdasarkan Role
function verifyRole(allowedRoles = []) {
  return (req, res, next) => {
    // 1. Cek apakah user sudah login atau belum
    if (!req.session || !req.session.user) {
      return res.redirect('/'); // Lempar kembali ke homepage jika belum login
    }

    const userRole = (req.session.user.role || '').toLowerCase();

    // 2. Administrator dan Finance memiliki akses penuh (All Access)
    if (userRole === 'administrator' || userRole === 'finance') {
      return next();
    }

    // 3. Cek apakah role user saat ini diizinkan untuk mengakses rute tersebut
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // 4. Jika role tidak sesuai / tidak memiliki hak akses (Munculkan Pop-up Peringatan)
    return res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <style>
          body { background-color: #0d1117; font-family: sans-serif; }
        </style>
      </head>
      <body>
        <script>
          Swal.fire({
            icon: 'error',
            title: 'Akses Ditolak!',
            text: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
            background: '#161b22',
            color: '#c9d1d9',
            confirmButtonColor: '#2ea043',
            confirmButtonText: 'Kembali'
          }).then(() => {
            window.history.back();
          });
        </script>
      </body>
      </html>
    `);
  };
}

module.exports = { verifyRole };