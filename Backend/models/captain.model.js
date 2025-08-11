const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CaptainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      index: true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    select: false,
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  socketId: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  vehicle: {
    color: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true,
      minlength: [6, 'Vehicle number must be at least 6 characters long']
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Vehicle capacity must be at least 1']
    },
    type: {
      type: String,
      required: true,
      enum: ['car', 'bike', 'auto']
    }
  },
  location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}

})

CaptainSchema.index({ location: "2dsphere" });

CaptainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '48h'
  })
  return token
}

CaptainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

CaptainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10)
}

const captainModel = mongoose.model('captain', CaptainSchema)

module.exports = captainModel
