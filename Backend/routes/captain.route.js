const express = require('express')
const router = express.Router()
const captainController = require('../controllers/captain.controller')
const { body } = require('express-validator')
const { authCaptain } = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware'); // Import the upload middleware

router.post(
  '/register',
  [
    body('fullname.firstname').notEmpty().withMessage('First name is required'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.number').notEmpty().withMessage('Vehicle number is required'),
    body('vehicle.capacity')
      .isInt({ min: 1 })
      .withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.type').notEmpty().withMessage('Vehicle type is required')
  ],
  captainController.registercaptain
)

router.post('/verify-email', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 characters long')
], captainController.verifyEmail);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  captainController.logincaptain
)

router.post('/send-otp', [body('email').isEmail()], captainController.sendLoginOtp);
router.post('/login-otp', [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 })
], captainController.loginWithOtp);

router.post('/forgot-password', [body('email').isEmail()], captainController.forgotPassword);
router.post('/reset-password', [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
    body('password').isLength({ min: 6 })
], captainController.resetPassword);


router.get('/profile', authCaptain, captainController.getcaptainprofile);
router.post('/logout', authCaptain, captainController.logoutcaptain);
router.patch('/details', authCaptain, captainController.updateCaptainDetails);
router.patch('/vehicle', authCaptain, captainController.updateVehicleDetails);

router.post(
  '/profile-picture',
  authCaptain,
  upload, // Use upload as middleware directly
  captainController.updateProfilePicture
);

module.exports = router