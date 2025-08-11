const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blackListTokenModel = require('../models/blackListToken.model')
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token })

  if (isBlacklisted) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded._id)

    req.user = user

    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.captaintoken || req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'token not found' })
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token })

  if (isBlacklisted) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const captain = await captainModel.findById(decoded._id)
    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' })
    }
    req.captain = captain
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
