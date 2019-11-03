var io = require('socket.io-client');
var socket = io.connect('http://localhost:5005', { transports: ['websocket'] });
socket.on('connect', function () {
  console.log('# CONNECTED');
  socket.emit('message', 'aa');
});
socket.on('message', function (data) {
  console.log(data);
});
socket.on('rece', function (data) {
  console.log(data);
});
socket.on('disconnect', function (err) {
  console.log(err);
});
