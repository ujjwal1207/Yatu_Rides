const captainModel = require('../models/captain.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blackListTokenModel = require('../models/blackListToken.model')
const { validationResult } = require('express-validator')
const cookieParser = require('cookie-parser')
const captainService = require('../services/captain.service')
const { authCaptain } = require('../middlewares/auth.middleware')
const captainmodel = require('../models/captain.model')

module.exports.registercaptain = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { fullname = {}, email, password, vehicle = {} } = req.body
    const { firstname, lastname } = fullname
    const { color, number, capacity, type } = vehicle

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !color ||
      !number ||
      !capacity ||
      !type
    ) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const existingCaptain = await captainModel.findOne({ email })
    if (existingCaptain) {
      return res
        .status(400)
        .json({ error: 'Captain with this email already exists' })
    }

    const hashedPassword = await captainModel.hashPassword(password)
    const captain = await captainService.createCaptain({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      color,
      number,
      capacity,
      type
    })
    const token = captain.generateAuthToken()
    const captainData = captain.toObject()
    delete captainData.password

    res.cookie('captaintoken', token)
    res.status(201).json({ token, captain: captainData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports.logincaptain = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { email, password } = req.body
  const captain = await captainModel.findOne({ email }).select('+password')
  if (!captain) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const isMatch = await captain.comparePassword(password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const captaintoken = captain.generateAuthToken()
  res.cookie('captaintoken', captaintoken)
  res.status(200).json({ captaintoken, captain })
}

module.exports.getcaptainprofile = async (req, res) => {
  try {
    const captain = req.captain
    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' })
    }
    res.status(200).json(captain)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports.logoutcaptain = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  await blackListTokenModel.create({ token })
  res.clearCookie('captaintoken')
  res.status(200).json({ message: 'Logged out successfully' })
}
