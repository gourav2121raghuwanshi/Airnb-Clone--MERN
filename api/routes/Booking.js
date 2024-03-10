const express = require('express');
const router = express.Router();
const {makeBooking,removeExpiredBookings}=require('../controllers/bookingController.js')


router.post('/booking',makeBooking);
router.get('/removeExpired',removeExpiredBookings);
module.exports = router;