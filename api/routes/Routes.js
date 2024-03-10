const express = require('express');
const router = express.Router();
const { signup ,login ,profile,logout,google} = require('../controllers/authController.js');
const {makePlace,getPlaces,getPlaceById,UpdatePlace,getAllPlaces}=require('../controllers/placesController.js');
const {makeBooking,getBookings,getSingleBooking,removeExpiredBookings}=require('../controllers/bookingController.js');
const {verifyToken} =require('../utils/verifyToken.js')
// User Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', google);
router.get('/profile', profile);


router.post('/places',verifyToken, makePlace);
router.put('/places/:id',verifyToken, UpdatePlace);
router.get('/getPlaces',verifyToken, getPlaces);
router.get('/places/:id', getPlaceById);
router.get('/all-places', getAllPlaces);
router.post('/booking', verifyToken,makeBooking);
router.get('/booking', verifyToken,getBookings);
router.get('/booking/:id',getSingleBooking);
router.get('/removeExpired',removeExpiredBookings);

// Places route

module.exports = router;