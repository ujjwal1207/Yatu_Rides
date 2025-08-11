const usermodel = require('../models/user.model');
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registeruser = async (req, res,next) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;
    const useralreadyExists = await usermodel.findOne({ email });
    if (useralreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await usermodel.hashPassword(password);
    const user = await userService.createuser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password: hashedPassword
    });
    
    if (!user || user.error) {
        console.error('Error creating user:', user.error);
        return res.status(500).json({ error: 'Error creating user' });
    }
    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(201).json({
       token,user
    });
};

module.exports.loginuser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await usermodel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
}

module.exports.getuserprofile = async (req, res, next) => {

    res.status(200).json(req.user);

}

module.exports.logoutuser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}