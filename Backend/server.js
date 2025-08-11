const http = require('http')
const app = require('./app')
const { initializeSocket } = require('./socket')

const server = http.createServer(app)
// Pass the HTTP server instance, not the Express app!
initializeSocket(server)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
