const express = require('express')
const router = express.Router()
const mapController = require('../controllers/maps.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { query } = require('express-validator')

router.get(
  '/get-coordinates',
  [query('address').isString().notEmpty().withMessage('Address is required')], // This one was correct
  authMiddleware.authUser,
  mapController.getCoordinate
)

// The error was here. The validation middleware needs to be in an array.
router.get(
  '/get-distance-time',
  [ // <--- ADD THIS BRACKET
    query('origin').isString().notEmpty().withMessage('Origin is required'),
    query('destination')
      .isString()
      .notEmpty()
      .withMessage('Destination is required')
  ], // <--- AND THIS BRACKET
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