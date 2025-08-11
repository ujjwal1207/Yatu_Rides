const SocketIo = require('socket.io')
const usermodel = require('./models/user.model')
const captainmodel = require('./models/captain.model')
let io

function initializeSocket (server) {
  io = SocketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })
  io.on('connection', socket => {
    console.log('A user connected:', socket.id)

    socket.on('join', async data => {
      const { userId, userType } = data
      console.log(
        `User ${userId} of type ${userType} joined with socket ID: ${socket.id}`
      )
      if (userType === 'user') {
        await usermodel.findByIdAndUpdate(userId, { socketId: socket.id })
      } else if (userType === 'captain') {
        await captainmodel.findByIdAndUpdate(userId, { socketId: socket.id })
      }
    })

    socket.on('update-location-captain', async ({ captainId, location }) => {
      if (
        !location ||
        typeof location.lat !== 'number' ||
        typeof location.lng !== 'number'
      ) {
        socket.emit('error', { message: 'Invalid location data.' })
        return
      }

      console.log(`Captain ${captainId} updated location:`, location)

      // Save in GeoJSON format for geospatial queries
      await captainmodel.findByIdAndUpdate(captainId, {
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        }
      })

      io.emit('captain-location-updated', { captainId, location })
    })

    socket.on('ride-confirmed', ride=>{
      setW
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject)
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data)
    console.log(`Message sent to socket ID ${socketId}:`, messageObject)
    
  } else {
    console.log('Socket.io not initialized.')
  }
}

module.exports = { initializeSocket, sendMessageToSocketId }
