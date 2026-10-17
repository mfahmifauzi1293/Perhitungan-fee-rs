const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyRole } = require('../controllers/authMiddleware');

router.get('/booking',verifyRole(['admin']), bookingController.getBooking);
router.post('/booking/simpan', verifyRole(['admin']), bookingController.simpanBooking);
router.post('/booking/pelunasan', verifyRole(['admin']), bookingController.prosesPelunasan);
router.get('/invoice/:id', verifyRole(['admin']), bookingController.getInvoice);
router.post('/booking/refund/:id', verifyRole(['admin']), bookingController.refundBooking);
router.post('/booking/cancel/:id', verifyRole(['admin']), bookingController.cancelBooking);
router.post('/booking/edit/:id', verifyRole(['admin']), bookingController.editBooking);

module.exports = router;