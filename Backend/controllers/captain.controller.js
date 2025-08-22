const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');
const {blacklisttoken}= require("../models/blacklistToken.model")
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail, sendLoginOtpEmail } = require('../services/mail.service');
const bcrypt = require('bcrypt');

// Register Captain
module.exports.registercaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, vehicle } = req.body;

    try {
        let captain = await captainModel.findOne({ email });

        if (captain && captain.isVerified) {
            return res.status(400).json({ message: 'Captain with this email already exists' });
        }

        const hashedPassword = await captainModel.hashPassword(password);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        if (captain && !captain.isVerified) {
            captain.password = hashedPassword;
            captain.fullname = fullname;
            captain.vehicle = vehicle;
            captain.verificationOtp = otp;
            captain.verificationOtpExpires = otpExpires;
            await captain.save();
        } else {
            captain = await captainModel.create({
                fullname,
                email,
                password: hashedPassword,
                vehicle,
                verificationOtp: otp,
                verificationOtpExpires: otpExpires
            });
        }
        
        await sendVerificationEmail(email, otp);
        res.status(200).json({ message: 'Verification OTP sent to your email.' });

    } catch (error) {
        console.error('Error in registercaptain:', error);
        res.status(500).json({ error: 'Error processing registration' });
    }
};

// Verify Captain's Email
module.exports.verifyEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    const captain = await captainModel.findOne({ email }).select('+verificationOtp +verificationOtpExpires');

    if (!captain || captain.verificationOtp !== otp || captain.verificationOtpExpires < Date.now()) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    captain.isVerified = true;
    captain.verificationOtp = undefined;
    captain.verificationOtpExpires = undefined;
    await captain.save({ validateBeforeSave: false });

    const captaintoken = captain.generateAuthToken();
    res.cookie('captaintoken', captaintoken);
    res.status(200).json({ captaintoken, captain });
};

// Login Captain with Password
module.exports.logincaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!captain.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const captaintoken = captain.generateAuthToken();
    res.cookie('captaintoken', captaintoken);
    res.status(200).json({ captaintoken, captain });
}

// Send OTP for Login
module.exports.sendLoginOtp = async (req, res) => {
    const { email } = req.body;
    const captain = await captainModel.findOne({ email });

    if (!captain) {
        return res.status(404).json({ message: 'Captain not found' });
    }
    if (!captain.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    captain.loginOtp = otp;
    captain.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await captain.save({ validateBeforeSave: false });

    try {
        await sendLoginOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        captain.loginOtp = undefined;
        captain.loginOtpExpires = undefined;
        await captain.save({ validateBeforeSave: false });
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

// Login Captain with OTP
module.exports.loginWithOtp = async (req, res) => {
    const { email, otp } = req.body;
    const captain = await captainModel.findOne({
        email,
        loginOtp: otp,
        loginOtpExpires: { $gt: Date.now() },
    }).select('+loginOtp +loginOtpExpires');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    captain.loginOtp = undefined;
    captain.loginOtpExpires = undefined;
    await captain.save({ validateBeforeSave: false });

    const captaintoken = captain.generateAuthToken();
    res.cookie('captaintoken', captaintoken);
    res.status(200).json({ captaintoken, captain });
};

// Get Captain Profile
module.exports.getcaptainprofile = async (req, res) => {
    res.status(200).json(req.captain);
}

// Update Captain Details
module.exports.updateCaptainDetails = async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        const captain = await captainModel.findById(req.captain._id);

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        if (firstname) captain.fullname.firstname = firstname;
        if (lastname) captain.fullname.lastname = lastname;
        if (email) captain.email = email;

        await captain.save();
        res.status(200).json({ message: 'Captain details updated successfully', captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Vehicle Details
module.exports.updateVehicleDetails = async (req, res) => {
    try {
        const { color, number, capacity, type } = req.body;
        const captain = await captainModel.findById(req.captain._id);

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        if (color) captain.vehicle.color = color;
        if (number) captain.vehicle.number = number;
        if (capacity) captain.vehicle.capacity = capacity;
        if (type) captain.vehicle.type = type;

        await captain.save();
        res.status(200).json({ message: 'Vehicle details updated successfully', captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Forgot Password
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const captain = await captainModel.findOne({ email });

    if (!captain) {
        return res.status(200).json({ message: 'If a captain with that email exists, a password reset OTP has been sent.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    captain.resetPasswordToken = otp;
    captain.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await captain.save({ validateBeforeSave: false });

    try {
        await sendPasswordResetEmail(captain.email, otp);
        res.status(200).json({ message: 'Password reset OTP sent to your email.' });
    } catch (err) {
        captain.resetPasswordToken = undefined;
        captain.resetPasswordExpires = undefined;
        await captain.save({ validateBeforeSave: false });
        return res.status(500).json({ message: 'Error sending email.' });
    }
};

// Reset Password
module.exports.resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    const captain = await captainModel.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!captain) {
        return res.status(400).json({ message: 'Password reset OTP is invalid or has expired.' });
    }

    captain.password = await captainModel.hashPassword(password);
    captain.resetPasswordToken = undefined;
    captain.resetPasswordExpires = undefined;
    await captain.save();

    const captaintoken = captain.generateAuthToken();
    res.status(200).json({ message: 'Password has been reset successfully.', captaintoken, captain });
};

// Change Password (when logged in)
module.exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oldPassword, newPassword } = req.body;
        const captain = await captainModel.findById(req.captain._id).select('+password');

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        const isMatch = await captain.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        captain.password = await captainModel.hashPassword(newPassword);
        await captain.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Profile Picture
module.exports.updateProfilePicture = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id);
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        
        const profilePictureUrl = req.file.path; // This now comes from multer-storage-cloudinary
        captain.profilePicture = profilePictureUrl;
        await captain.save();

        res.status(200).json({ message: 'Profile picture updated', captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout Captain
module.exports.logoutcaptain = async (req, res) => {
    res.clearCookie('captaintoken');
    const token = req.cookies.captaintoken || req.headers.authorization?.split(' ')[1];
    if (token) {
        await blacklisttoken.create({ token });
    }
    res.status(200).json({ message: 'Logged out successfully' });
};