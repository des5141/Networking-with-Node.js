const ConnectEvent = require('../StarrySkyConnected.js')

// Socketio user logic
function SocketioUser (get, sock) {
  // receive data
  sock.on('message', (data) => {
    data = JSON.parse(data)
  })

  // send data
  sock.post = (signal, data) => {
    data = JSON.stringify({ id: signal, msg: JSON.stringify(data) })
    sock.send(data)
  }

  get.UserList.push(sock)
  ConnectEvent(sock)
}

module.exports = SocketioUser
