var UserPreset = require('./Socket.io/StarrySkySocketioUser.js')

// socketio server logic
class SocketioServer {
  constructor (get) {
    this.global = get
    this.http = require('http').createServer()
    this.socketio = require('socket.io').listen(this.http)
    this.socketio.set('log level', 0)

    // event emitter
    this.http.on('error', (err) => {
      console.log('Socket.IO crashed :\r\n', err.message)
    })

    this.socketio.on('connection', (sock) => {
      UserPreset(this.global, sock)
    })
  }

  listen (ip, port) {
    this.http.listen(port, ip)
  }
}

module.exports = SocketioServer
