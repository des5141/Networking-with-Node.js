// main engine logic
class Server {
  constructor () {
    console.log('# Hello StarrySky World!')

    // load modules
    this.global = { UserList: [], SignalEvent: [] }
    require('./StarrySkyLoadEvents.js')(this.global)
    this.tcp = new (require('./StarrySkyTCP.js'))(this.global)
    this.socketio = new (require('./StarrySkySocketio.js'))(this.global)
    console.log('# Server Loaded')
    console.log(this.global)
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
