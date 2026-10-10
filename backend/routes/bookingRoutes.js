const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/booking', bookingController.getBooking);
router.post('/booking/simpan', bookingController.simpanBooking);
router.post('/booking/pelunasan', bookingController.prosesPelunasan);
router.get('/invoice/:id', bookingController.getInvoice);
router.post('/booking/refund/:id', bookingController.refundBooking);

module.exports = router;