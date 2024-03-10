const Place = require('../models/PlaceModel');

exports.makePlace = async (req, res) => {
    try {
        console.log("in");
        const {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests,price
        } = req.body;
        const id = req.user.id;

        
        console.log("user id is : ", id);
        const newPlace = await Place.create({
            owner: id,
            title, address, photos: addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests,price
        });
        console.log("out");
        res.status(201).json(newPlace);
    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getPlaces = async (req, res) => {
    try {
        const id = req.user.id;
        console.log(id);
        const UserPlaces = await Place.find({ owner: id });
        console.log(UserPlaces);
        return res.json(UserPlaces);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const UserPlaces = await Place.findById(id);
        console.log(UserPlaces);
        return res.json(UserPlaces);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.UpdatePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const place =await Place.findById(id);
        // const reqid= place.owner.split('(');
        // console.log(reqid);
        console.log(place.owner._id);
        console.log(req.user.id);
        if(place.owner.toString()!==req.user.id){
            console.log("no match")
            return res.status(500).json({ error: "you can update your own Places only. " });  
        }
        const {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests,price
        } = req.body;

        const updatedPlace = await Place.findByIdAndUpdate(id, {
            title, address, photos: addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests,price
        }, { new: true });

        console.log(updatedPlace);
        return res.json(updatedPlace);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllPlaces = async (req, res) => {
    try {
        const UserPlaces = await Place.find({});
        console.log(UserPlaces);
        return res.json(UserPlaces);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};