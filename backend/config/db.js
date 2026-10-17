const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fee_rs'
});

db.connect((err) => {
  if (err) {
    console.error('Gagal terhubung ke MySQL:', err);
    return;
  }
  console.log('Terhubung ke MySQL Server.');
});

module.exports = db;