// tcp server logic
class TCPServer {
  constructor () {
    this.net = require('net').createServer()

    // event emitter
    this.net.on('error', (err) => {
      console.log('TCP crashed :\r\n', err.message)
    })
  }

  listen (ip, port) {
    this.net.listen(port, ip)
  }
}

module.exports = TCPServer
