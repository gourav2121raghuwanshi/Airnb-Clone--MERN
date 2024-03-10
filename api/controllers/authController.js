const User = require('../models/UserModel.js')
const bcrypt = require('bcrypt');
require('dotenv').config();
const { errorHandler } = require('../utils/errorHandler.js');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json(`User Created Successfully ${user}`);

    } catch (err) {
        console.log(`error in signup ${err.message}`);
        next(err);
    }
};




exports.login = async (req, res,next) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, "User Not Found!"));
        }
        const hashedPassword = validUser.password;
        const validPassword = await bcrypt.compare(password, hashedPassword);
        if (!validPassword) {
            return ;
            next(errorHandler(401, "Wrong Credentials"));
        }

        const payload = {
            email: validUser.email,
            id: validUser._id,
            name:validUser.name
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2d",
        });
        console.log(token);
        const userWithToken = { ...validUser.toObject(), token };

        const { password: pass, ...rest } = userWithToken;
        const options = {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly: true,

        };
        res.cookie("token", token, options).status(200).json( rest);
        
    } catch (err) {
        console.log(err.message);
        next(err);
    }
}


exports.google = async (req, res) => {
    try {
        const {email}=req.body;
        console.log("mail is " ,email);
        const user = await User.findOne({ email });
        if (user) {
            const payload = {
                email: email,
                id: user._id,
                name:user.name
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2d",
            });
            console.log("token is " ,token);
             const { password: pass, ...rest } = user._doc;
            const options = {
                expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json( rest);
    

        } else {
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatePassword, 10);
            const Newuser = await User.create({ name: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword });
           
            const { password: pass, ...rest } = user._doc;
            const options = {
                expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            const payload = {
                email: email,
                id: Newuser._id,
                name:Newuser.name
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2d",
            });
            res.cookie("token", token, options).status(200).json( rest);
       
        }
    } catch (err) {
        console.log("error occured " ,err);
        res.status(401).join(err);
    }
}

exports.profile = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        if (!token) {
            return next(errorHandler(401, "Unauthorized: Token is empty or incorrect"));
        }

        jwt.verify(token, process.env.JWT_SECRET,async (err, userData) => {
            if (err) return next(errorHandler(403, `Forbidden: ${err}`));
             const {name,email,_id} =await User.findById(userData.id);
             res.json({name,email,_id});
        });
    } catch (err) {
        console.log(`error in signup ${err.message}`);
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {

        res.clearCookie('token');
        res.status(200).json('user has been logged out !');

    } catch (err) {
        console.log(`error in signup ${err.message}`);
        next(err);
    }
};