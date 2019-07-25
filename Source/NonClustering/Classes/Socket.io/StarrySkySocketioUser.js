const ConnectEvent = require('../StarrySkyConnected.js')

// Socketio user logic
function SocketioUser (get, sock) {
  // receive data
  sock.on('message', (data) => {
    data = JSON.parse(data)
    get.SignalEvent[data.id](sock, data.msg)
  })

  // send data
  sock.post = (signal, data) => {
    data = JSON.stringify({ id: signal, msg: JSON.stringify(data) })
    sock.send(data)
  }

  // close or error
  sock.on('disconnect', _ => {
    get.UserList.splice(get.UserList.indexOf(sock), 1)
  })
  sock.on('error', _ => {
    get.UserList.splice(get.UserList.indexOf(sock), 1)
  })

  get.UserList.push(sock)
  ConnectEvent(sock)
}

module.exports = SocketioUser
