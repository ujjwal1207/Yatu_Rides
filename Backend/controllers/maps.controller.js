const mapService = require('../services/maps.service')
const { validationResult } = require('express-validator')

module.exports.getCoordinate = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { address } = req.query
  console.log('Received address:', address)

  if (!address) {
    return res.status(400).json({ error: 'Address is required' })
  }

  try {
    const coordinates = await mapService.getAddressCoordinate(address)
    res.status(200).json(coordinates)
  } catch (error) {
    res.status(404).json({ error: 'coordinates not found holaaaaaaaaaa' })
  }
}

module.exports.getDistanceAndTime = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { origin, destination } = req.query

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ error: 'Origin and destination are required' })
    }

    const distanceAndTime = await mapService.getDistanceAndTime(
      origin,
      destination
    )
    res.status(200).json(distanceAndTime)
  } catch (error) {
    console.error('Error in getDistanceAndTime:', error.message)
    res.status(404).json({ error: 'Distance and time not found' })
  }
}

module.exports.getAutoCompleteSuggestions = async (req, res) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() })
    }
    const { input } = req.query
    if (!input) {
      return res.status(400).json({ error: 'Input is required' })
    }
    const suggestions = await mapService.getAutoCompleteSuggestions(input)
    res.status(200).json(suggestions)
  } catch (error) {
    console.error('Error in getAutoCompleteSuggestions:', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}


