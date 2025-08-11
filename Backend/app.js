const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
app.use(cors())
const connectToDb = require('./db/db')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json()) // ✅ Required to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // optional

connectToDb()

const mapsRoutes = require('./routes/maps.route')
const userRoutes = require('./routes/user.route')
const captainRoutes = require('./routes/captain.route')
const rideRoutes = require('./routes/rides.route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/maps', mapsRoutes)
app.use('/rides', rideRoutes)

module.exports = app
