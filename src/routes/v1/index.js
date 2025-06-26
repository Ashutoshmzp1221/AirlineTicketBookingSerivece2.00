const express = require('express');
const { BookingController } = require('../../controllers/index')
const router = express.Router();

router.post('/bookings', BookingController.create);
router.patch('/bookings/:bookingId/cancel', BookingController.cancel);

module.exports = router;