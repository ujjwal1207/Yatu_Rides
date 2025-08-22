const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
app.use(cors({
  origin: process.env.FRONTEND_URL, // Set this in your Render environment variables
  credentials: true
}));
const connectToDb = require('./db/db')
const cookieParser = require('cookie-parser')
const path = require('path');

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// This line will serve the 'dist' folder once you build the frontend for production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

connectToDb()

const mapsRoutes = require('./routes/maps.route')
const userRoutes = require('./routes/user.route')
const captainRoutes = require('./routes/captain.route')
const rideRoutes = require('./routes/rides.route')

app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/maps', mapsRoutes)
app.use('/rides', rideRoutes)


module.exports = app