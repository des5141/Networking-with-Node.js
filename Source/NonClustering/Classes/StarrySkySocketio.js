// socketio server logic
class SocketioServer {
  constructor () {
    this.http = require('http').createServer()
    this.socketio = require('socket.io').listen(this.http)
    this.socketio.set('log level', 0)

    // event emitter
    this.http.on('error', (err) => {
      console.log('Socket.IO crashed :\r\n', err.message)
    })
  }

  listen (ip, port) {
    this.http.listen(port, ip)
  }
}

module.exports = SocketioServer
