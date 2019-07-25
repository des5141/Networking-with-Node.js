// socketio server logic
class SocketioServer {
  constructor (get) {
    this.global = get
    this.http = require('http').createServer()
    this.socketio = require('socket.io').listen(this.http)
    this.socketio.set('log level', 0)
    this.user_list = []

    // event emitter
    this.http.on('error', (err) => {
      console.log('Socket.IO crashed :\r\n', err.message)
    })

    this.socketio.on('connection', (sock) => {

    })
  }

  listen (ip, port) {
    this.http.listen(port, ip)
  }
}

module.exports = SocketioServer
