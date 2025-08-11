const mongoose = require('mongoose')
const usermodel = require('../models/user.model')

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'captain',
      required: false
    },
    pickup: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    fare: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'ongoing', 'cancelled'],
      default: 'pending'
    },
    duration: {
      type: Number,
      required: false
    },
    distance: {
      type: Number,
      required: false
    },
    paymentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: false
    },
    orderid: {
      type: String,
      required: false
    },
    signature: {
      type: String,
      required: false
    },
    otp: { type: String, required: function() { return this.status === 'pending' }, select: false }

  },
  { timestamps: true }
)

const rideModel = mongoose.model('Ride', rideSchema)
module.exports = rideModel
