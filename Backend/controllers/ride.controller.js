const rideService = require('../services/newride.service')
const { validationResult } = require('express-validator')
const mapservice = require('../services/maps.service')
const { sendMessageToSocketId } = require('../socket')
const rideModel = require('../models/rides.model')

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  if (!req.user) {
    console.error('No user found in request')
    return res.status(401).json({ message: 'Unauthorized: No user found' })
  }

  const { Pickup, Destination, rideType } = req.body
  try {
    const ride = await rideService.createRide(
      req.user,
      Pickup,
      Destination,
      rideType
    )
    res.status(201).json(ride)

    const pickupCoordinates = await mapservice.getAddressCoordinate(Pickup)
    console.log('Pickup coordinates:', pickupCoordinates)

    const captainsInRadius = await mapservice.getcaptainsinradius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      10
    )
    console.log(
      `Found ${captainsInRadius.length} captains in the radius of 2 km`
    )

    ride.otp = ''

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate('user')

    captainsInRadius.map(captain => {
      sendMessageToSocketId(captain.socketId, {
        event: 'new-ride',
        data: rideWithUser
      })
    })
  } catch (err) {
    console.log('the error is', err)
    return res.status(500).json({ message: err.message })
  }
}
module.exports.getFare = async (req, res) => {
  try {
    const { Pickup, Destination } = req.query

    if (!Pickup || !Destination) {
      return res
        .status(400)
        .json({ message: 'Pickup and dropoff locations are required' })
    }

    const fare = await rideService.getfare(Pickup, Destination)
    return res.status(200).json({ fare })
  } catch (error) {
    console.error('Error fetching fare:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { rideId } = req.body
  if (!rideId) {
    return res.status(400).json({ message: 'Ride ID is required' })
  }
  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain // taken from authCaptain
    })
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' })
    }
    console.log('Ride confirmed:', ride)

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-confirmed',
      data: ride
    })
    return res.status(200).json(ride)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { rideId, otp } = req.query

  if (!rideId || !otp) {
    return res.status(400).json({ message: 'Ride ID and OTP are required' })
  }

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain
    })
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found or invalid OTP' })
    }
    ride.otp = otp // ✅ ensures validation passes
    await ride.save()
    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-started',
      data: ride
    })

    return res.status(200).json(ride)
  } catch (err) {
    console.error('Error starting ride:', err)
    return res.status(500).json({ message: err.message })
  }
}

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { rideId } = req.body
  if (!rideId) {
    return res.status(400).json({ message: 'Ride ID is required' })
  }

  try {
    const ride = await rideService.endRide({
      rideId,
      captain: req.captain // taken from authCaptain
    })
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' })
    }
    console.log('Ride ended:', ride)

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-ended',
      data: ride
    })
    return res.status(200).json(ride)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}