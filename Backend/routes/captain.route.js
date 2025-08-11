const express = require('express')
const router = express.Router()
const captainController = require('../controllers/captain.controller')
const { body } = require('express-validator')
const { authCaptain } = require('../middlewares/auth.middleware')
const captainModel = require('../models/captain.model')


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

router.get('/profile', authCaptain, captainController.getcaptainprofile);

router.post('/logout', authCaptain, captainController.logoutcaptain);

module.exports = router

