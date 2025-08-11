const axios = require('axios')
const captainmodel = require('../models/captain.model')

module.exports.getAddressCoordinate = async address => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is missing')
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`

  try {
    const response = await axios.get(url)

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location
      return {
        lat: location.lat,
        lng: location.lng
      }
    } else {
      console.error(
        'Google Maps API returned:',
        JSON.stringify(response.data, null, 2)
      )
      throw new Error('Unable to get coordinates for the address')
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error.message)
    throw error
  }
}

module.exports.getDistanceAndTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required')
  }

  try {
    const apikey = process.env.GOOGLE_MAPS_API_KEY
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(destination)}&key=${apikey}`

    const response = await axios.get(url)
    if (response.data.status === 'OK') {
      if (
        response.data.rows.length === 0 ||
        response.data.rows[0].elements.length === 0
      ) {
        throw new Error('No routes found ')
      }
      return response.data.rows[0].elements[0]
    }
  } catch (error) {
    res.status(404).json({ error: 'Distance and time not found' })
  }
}

module.exports.getAutoCompleteSuggestions = async input => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is missing')
  }
  if (!input || input.trim() === '') {
    throw new Error('Input is required for autocomplete suggestions')
  }
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`
  try {
    const response = await axios.get(url)

    if (response.data.status === 'OK') {
      return response.data.predictions
    } else {
      console.error(
        'Google Maps API returned:',
        JSON.stringify(response.data, null, 2)
      )
      throw new Error('Unable to get autocomplete suggestions')
    }
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error.message)
    throw error
  }
}

module.exports.getcaptainsinradius = async (lat, lng, radius) => {
  // radius in km

  const captains = await captainmodel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius / 6378.1] // radius in radians
      }
    }
  })

  return captains
}
