const express = require('express')
const router = express.Router()
const mapController = require('../controllers/maps.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { query } = require('express-validator')

router.get(
  '/get-coordinates',
  [query('address').isString().notEmpty().withMessage('Address is required')],
  authMiddleware.authUser,
  mapController.getCoordinate
)

router.get(
  '/get-distance-time',
  query('origin').isString().notEmpty().withMessage('Origin is required'),
  query('destination')
    .isString()
    .notEmpty()
    .withMessage('Destination is required'),
  authMiddleware.authUser,
  mapController.getDistanceAndTime
)
router.get(
  '/get-suggestions', 
  [query('input').isString().notEmpty().withMessage('Input is required')],
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestions
)

module.exports = router
