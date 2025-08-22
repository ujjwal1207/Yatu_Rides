const express = require('express')
const router = express.Router()
const usercontroller = require('../controllers/user.controller')
const { body } = require('express-validator')
const auth = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware'); // Import the upload middleware

router.post(
  '/register',
  [
    body('fullname.firstname').notEmpty().withMessage('First name is required'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  usercontroller.registeruser
)

router.post(
  '/verify-email',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 characters long')
  ],
  usercontroller.verifyEmail
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  usercontroller.loginuser
)

router.patch('/details', auth.authUser, usercontroller.updateUserDetails)

router.post(
  '/change-password',
  auth.authUser,
  [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  usercontroller.changePassword
)

router.post('/send-otp', [body('email').isEmail()], usercontroller.sendLoginOtp);
router.post('/login-otp', [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 })
], usercontroller.loginWithOtp);


router.post('/forgot-password', [body('email').isEmail()], usercontroller.forgotPassword);
router.post('/reset-password', [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
    body('password').isLength({ min: 6 })
], usercontroller.resetPassword);


router.post(
  '/profile-picture',
  auth.authUser,
  upload, // Use upload as middleware directly
  usercontroller.updateProfilePicture
);

router.get('/profile', auth.authUser, usercontroller.getuserprofile)

router.post('/logout', auth.authUser, usercontroller.logoutuser)
module.exports = router