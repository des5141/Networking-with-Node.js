const server = require('./Classes/router.js');

server.listen({
  tcpPort: 5834,
  SocketIOPort: 5883,
  ip: '127.0.0.1'
});
