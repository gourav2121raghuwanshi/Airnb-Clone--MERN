const Booking = require('../models/BookingModel');
const mongoose = require('mongoose');
exports.makeBooking = async (req, res) => {
    try {
        const id = req.user.id;
        const { checkIn, checkOut, numberOfGuests, name, phone, place, price } = req.body;
        console.log({ checkIn, checkOut, numberOfGuests, name, phone, place, price })
        // const { user, place, checkIn, checkOut, phone, name } = req.body;

        // Corrected syntax: use parentheses for the object passed to create method
        const newBooking = await Booking.create({ user: id, place, numberOfGuests, checkIn, checkOut, phone, name, price });
        console.log(newBooking)
        return res.status(201).json(newBooking);
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(508).json({ error: 'Internal Server Error' });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const id = req.user.id;
        const userBookings = await Booking.find({ user: id }).populate('place')
        return res.json(userBookings);

    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getSingleBooking = async (req, res) => {
    try {
        const { id } = req.params.id;
        const userBookings = await Booking.findOne(id).populate('place')
        return res.json(userBookings);

    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.removeExpiredBookings = async (req, res) => {
    try {
        const currentDate = new Date();

        const expiredBookings = await Booking.find({ checkOut: { $lt: currentDate } });

        for (const booking of expiredBookings) {
            await Booking.deleteOne({ _id: booking._id });
        }

        return res.status(201).json("All bookings are now up to date");
    } catch (error) {
        console.error('Error removing expired bookings:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};