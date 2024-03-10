const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, title: {
            type: String,

        },
        address: {
            type: String,
        },
        
        photos: {
            type: Array,
        },
        description: {
            type: String,
        },
        perks: [String],
        price: Number,
        extraInfo: String,
        checkIn: Number,
        checkOut: Number,
        maxGuests: Number,
    }
);

module.exports = mongoose.model("Place", placeSchema);