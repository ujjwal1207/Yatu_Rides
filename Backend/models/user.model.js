const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
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
  verificationOtp: {
    type: String,
    select: false,
  },
  verificationOtpExpires: {
    type: Date,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String, // URL to the image
    default: ''
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpires: {
    type: Date,
    select: false,
  },
  loginOtp: {
    type: String,
    select: false,
  },
  loginOtpExpires: {
    type: Date,
    select: false,
  }
})
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '48h'
  })
  return token
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10)
}

const usermodel = mongoose.model('user', userSchema)
module.exports = usermodel
