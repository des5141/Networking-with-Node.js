//  Make modules
const tcp_server = require('net').createServer();
const sio_proxy = require('http').createServer();
const sio_server = require('socket.io').listen(sio_proxy);
sio_server.set('log level', 0);

// Variables init
const signal_event = new Array();
const connect_event = (require('./connect.js'));

// ? Event
tcp_server.on('error', function (err) { console.log('TCP crashed :\r\n', err.message); });
tcp_server.on('connection', function (sock) { new DualSocket(sock, true); });
sio_proxy.on('error', function (err) { console.log('Socket.IO crashed :\r\n', err.message); });
sio_server.sockets.on('connection', function (sock) { new DualSocket(sock, false); });

// ? Function
function DualSocket (socket, is_tcp) {
  if (is_tcp) type = 'data'; else type = 'message';
  socket.on(type, (data) => {
    data = JSON.parse(data);
    signal_event[data.id](socket, data.msg);
  });

  function close (func) {
    if (is_tcp) socket.on('close', func); else socket.on('disconnect', func);
  }

  socket.post = (signal, data) => {
    data = JSON.stringify({ id: signal, msg: data });
    if (is_tcp) { socket.write(data); } else { socket.send(data); }
  };

  // connect
  connect_event(socket);

  return {
    socket: socket,
    is_tcp: is_tcp,
    close: close
  };
}

// ? Import Signal Event
const fs = require('fs');

function import_script (dir) {
  const ev = fs.readdirSync(dir);
  for (let i = 0; i < ev.length; i++) {
    const file = ev[i];
    if (file.replace(/.*\./gi, '') == 'js') {
      const temp = (require(`../${dir}/${ev[i]}`));
      signal_event[temp.index] = temp.func;
      console.log(`   load - ../${dir}/${ev[i]}`.replace('../', ''));
    }

    if (file.match(/.*\./gi) == null) import_script(dir + '/' + ev[i]);
  }
}
import_script('Event');

// ? Export
module.exports = {
  listen: function (option) {
    if (option.tcpPort == option.SocketIOPort) { throw '# TCP port is must not same to Socket.io port'; }
    if (option.tcpPort != null) { tcp_server.listen(option.tcpPort, option.ip); }
    if (option.SocketIOPort != null) { sio_proxy.listen(option.SocketIOPort, option.ip); }
  }
};
