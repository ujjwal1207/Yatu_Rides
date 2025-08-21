const usermodel = require('../models/user.model');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail, sendLoginOtpEmail } = require('../services/mail.service');
const bcrypt = require('bcrypt');

// Register User
module.exports.registeruser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // This line was moved up to be reachable
    const { fullname, email, password } = req.body;

    try {
        let user = await usermodel.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await usermodel.hashPassword(password);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        if (user && !user.isVerified) {
            // Update existing unverified user
            user.password = hashedPassword;
            user.fullname = fullname;
            user.verificationOtp = otp;
            user.verificationOtpExpires = otpExpires;
            await user.save();
        } else {
            // Create new user
            user = await usermodel.create({
                fullname,
                email,
                password: hashedPassword,
                verificationOtp: otp,
                verificationOtpExpires: otpExpires
            });
        }
        
        await sendVerificationEmail(email, otp);

        res.status(200).json({ message: 'Verification OTP sent to your email.' });

    } catch (error) {
        console.error('Error in registeruser:', error);
        res.status(500).json({ error: 'Error processing registration' });
    }
};

// Verify User's Email
module.exports.verifyEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    const user = await usermodel.findOne({ email }).select('+verificationOtp +verificationOtpExpires');

    if (!user || user.verificationOtp !== otp || user.verificationOtpExpires < Date.now()) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, user });
};

// Login User with Password
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

    if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, user });
}

// Send OTP for Login
module.exports.sendLoginOtp = async (req, res) => {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.loginOtp = otp;
    user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    try {
        await sendLoginOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        user.loginOtp = undefined;
        user.loginOtpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

// Login User with OTP
module.exports.loginWithOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await usermodel.findOne({
        email,
        loginOtp: otp,
        loginOtpExpires: { $gt: Date.now() },
    }).select('+loginOtp +loginOtpExpires');

    if (!user) {
        return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, user });
};

// Get User Profile
module.exports.getuserprofile = async (req, res, next) => {
    res.status(200).json(req.user);
}

// Update User Details
module.exports.updateUserDetails = async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        const user = await usermodel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (firstname) user.fullname.firstname = firstname;
        if (lastname) user.fullname.lastname = lastname;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Forgot Password
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.status(200).json({ message: 'If a user with that email exists, a password reset OTP has been sent.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
        await sendPasswordResetEmail(user.email, otp);
        res.status(200).json({ message: 'Password reset OTP sent to your email.' });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: 'Error sending email.' });
    }
};

// Reset Password
module.exports.resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    const user = await usermodel.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
        return res.status(400).json({ message: 'Password reset OTP is invalid or has expired.' });
    }

    user.password = await usermodel.hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = user.generateAuthToken();
    res.status(200).json({ message: 'Password has been reset successfully.', token, user });
};

// Change Password (when logged in)
module.exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oldPassword, newPassword } = req.body;
        const user = await usermodel.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        user.password = await usermodel.hashPassword(newPassword);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Profile Picture
module.exports.updateProfilePicture = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        
        const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
        user.profilePicture = profilePictureUrl;
        await user.save();

        res.status(200).json({ message: 'Profile picture updated', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout User
module.exports.logoutuser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
        await blackListTokenModel.create({ token });
    }
    res.status(200).json({ message: 'Logged out' });
}
