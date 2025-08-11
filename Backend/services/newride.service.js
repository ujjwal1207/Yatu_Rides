const rideModel = require('../models/rides.model')
const mapService = require('../services/maps.service')
const crypto = require('crypto')

module.exports = {
  // Calculate fare between two locations
  async getfare (pickup, destination) {
    if (!pickup || !destination) {
      throw new Error('Pickup and destination are required')
    }

    const distanceTime = await mapService.getDistanceAndTime(
      pickup,
      destination
    )

    const baseFare = { auto: 30, car: 50, bike: 20 }
    const perKmRate = { auto: 8, car: 10, bike: 5 }
    const perMinuteRate = { auto: 2, car: 3, bike: 1 }

    const distanceValue =
      distanceTime.distance && typeof distanceTime.distance.value === 'number'
        ? distanceTime.distance.value
        : 0

    const durationValue =
      distanceTime.duration && typeof distanceTime.duration.value === 'number'
        ? distanceTime.duration.value
        : 0

    return {
      auto: Math.round(
        baseFare.auto +
          (distanceValue / 1000) * perKmRate.auto +
          (durationValue / 60) * perMinuteRate.auto
      ),
      car: Math.round(
        baseFare.car +
          (distanceValue / 1000) * perKmRate.car +
          (durationValue / 60) * perMinuteRate.car
      ),
      bike: Math.round(
        baseFare.bike +
          (distanceValue / 1000) * perKmRate.bike +
          (durationValue / 60) * perMinuteRate.bike
      )
    }
  },

  // Generate OTP
  getotp () {
    return crypto.randomInt(Math.pow(10, 5), Math.pow(10, 6)).toString()
  },

  // Create a new ride
  async createRide (user, Pickup, Destination, rideType) {
    if (!user || !Pickup || !Destination || !rideType) {
      throw new Error('All fields are required')
    }

    const fares = await this.getfare(Pickup, Destination)
    const fare = fares[rideType]

    if (fare === undefined) {
      throw new Error('Invalid ride type')
    }

    const newRide = new rideModel({
      user: user._id,
      pickup: Pickup,
      destination: Destination,
      fare: fare,
      otp: this.getotp()
    })

    return await newRide.save()
  },

  // Confirm a ride for a captain
  async confirmRide ({ rideId, captain }) {
    if (!rideId) {
      throw new Error('Ride id is required')
    }

    await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: 'accepted', captain: captain._id }
    )

    const ride = await rideModel
      .findOne({ _id: rideId })
      .populate('user')
      .populate('captain')
      .select('+otp')

    if (!ride) {
      throw new Error('Ride not found')
    }

    return ride
  },

  // Start a ride
  async startRide ({ rideId, otp, captain }) {
    if (!rideId || !otp || !captain) {
      throw new Error('Ride ID, OTP, and captain are required')
    }

    const ride = await rideModel
      .findOne({ _id: rideId })
      .populate('user')
      .populate('captain')
      .select('+otp')

    if (!ride) {
      throw new Error('Invalid ride ID or OTP')
    }

    if (ride.otp !== otp) {
      throw new Error('Invalid OTP')
    }

    if (ride.status !== 'accepted') {
      throw new Error('Ride is not in accepted status')
    }

    ride.status = 'ongoing'

    ride.otp = '' // Clear OTP after starting the ride

    await ride.save()

    return ride
  },

  // End a ride
  async endRide ({ rideId, captain }) {
    if (!rideId || !captain) {
      throw new Error('Ride ID and captain are required')
    }

    const ride = await rideModel.findOneAndUpdate(
      { _id: rideId, captain: captain._id },  
      { status: 'completed' }
    ).populate('user').populate('captain').select('+otp')
    if (!ride) {
      throw new Error('Ride not found or you are not the captain of this ride')
    }
    return ride
  }
}
