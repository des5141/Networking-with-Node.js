var UserPreset = require('./TCP/StarrySkyTCPUser.js')

// tcp server logic
class TCPServer {
  constructor (get) {
    this.global = get
    this.net = require('net').createServer()

    // event emitter
    this.net.on('error', (err) => {
      console.log('TCP crashed :\r\n', err.message)
    })

    this.net.on('connection', (sock) => {
      UserPreset(this.global, sock)
    })
  }

  listen (ip, port) {
    this.net.listen(port, ip)
  }
}

module.exports = TCPServer
