// tcp server logic
class TCPServer {
  constructor (get) {
    this.global = get
    this.net = require('net').createServer()
    this.user_list = []

    // event emitter
    this.net.on('error', (err) => {
      console.log('TCP crashed :\r\n', err.message)
    })

    this.net.on('connection', (sock) => {

    })
  }

  listen (ip, port) {
    this.net.listen(port, ip)
  }
}

module.exports = TCPServer
