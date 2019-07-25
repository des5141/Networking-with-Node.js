const ConnectEvent = require('../StarrySkyConnected.js')

// tcp user logic
function TCPUser (get, sock) {
  // receive data
  sock.on('data', (data) => {
    data = JSON.parse(data)
    get.SignalEvent[data.id](sock, data.msg)
  })

  // send data
  sock.post = (signal, data) => {
    data = JSON.stringify({ id: signal, msg: JSON.stringify(data) })
    sock.write(data)
  }

  get.UserList.push(sock)
  ConnectEvent(sock)
}

module.exports = TCPUser
