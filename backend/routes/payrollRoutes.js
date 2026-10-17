const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/', verifyRole([]), payrollController.getPayrollPeriode);
router.get('/detail', verifyRole([]), payrollController.getPayrollDetail);
router.post('/generate', verifyRole([]), payrollController.generatePayroll);

// Ubah baris ini (buang kata '/payroll' di depannya)
router.get('/cetak-slip', payrollController.cetakSlipGaji);

module.exports = router;