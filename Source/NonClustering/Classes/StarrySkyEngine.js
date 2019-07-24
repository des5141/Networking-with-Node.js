// main engine logic
class Server {
  constructor () {
    console.log('Hello StarrySky World!')

    // load modules
    this.tcp = new (require('./StarrySkyTCP.js'))()
    this.socketio = new (require('./StarrySkySocketio.js'))()
  }

  listen (ip, tcpport, socketioport) {
    this.ip = ip
    this.tcp_port = tcpport
    this.socketio_port = socketioport

    // starting server
    this.socketio.listen(this.ip, this.socketio_port)
    this.tcp.listen(this.ip, this.tcp_port)
  }
}

module.exports = Server
