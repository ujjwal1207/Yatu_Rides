const express = require('express')
const router = express.Router()
const mapController = require('../controllers/maps.controller')
const rideController = require('../controllers/ride.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { body, query } = require('express-validator')
router.post(
  '/create',
  authMiddleware.authUser,
  body('Pickup').notEmpty().withMessage('Pickup location is required'),
  body('Destination').notEmpty().withMessage('Dropoff location is required'),
  body('rideType').notEmpty().withMessage('Ride type is required'),
  rideController.createRide
)

router.get(
  '/get-fare',
  authMiddleware.authUser,
  query('Pickup').notEmpty().withMessage('Pickup location is required'),
  query('Destination').notEmpty().withMessage('Dropoff location is required'),
  rideController.getFare
)

router.post(
  '/confirm',
  authMiddleware.authCaptain,
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  rideController.confirmRide
)

router.get(
  '/start-ride',
  authMiddleware.authCaptain,
  query('rideId').isMongoId().withMessage('Invalid ride id'),
  query('otp').notEmpty().withMessage('OTP is required'),
  rideController.startRide
)

router.post(
  '/end-ride',
  authMiddleware.authCaptain,
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  rideController.endRide
)

module.exports = router
