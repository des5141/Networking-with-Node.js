// https://bcho.tistory.com/899
module.exports = function (cluster, scripts) {
  const app = require('express')();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const redisAdapter = require('socket.io-redis');

  // Events
  const eventDir = `${__dirname.split('/Core')[0]}/Event`;
  const connectEvent = require(`${eventDir}/connect.js`);
  const disconnectEvent = require(`${eventDir}/disconnect.js`);
  const startEvent = require(`${eventDir}/start.js`);
  const updateEvent = require(`${eventDir}/update.js`);

  // Prefab
  const prefabDir = `${__dirname.split('/Core')[0]}/Prefab`;
  const socketPrefab = require(`${prefabDir}/socket.js`);

  io.adapter(redisAdapter({ host: 'rhea31.duckdns.org', port: 6379 }));

  // User connection
  io.sockets.on('connection', function (socket) {
    connectEvent(socket, cluster);

    // init user data
    for (var idx in socketPrefab) { socket[idx] = socketPrefab[idx]; }
    socket.nickname = socket.id + ' - nickname';

    // inject scripts into socket.io
    for (idx in scripts) { socket.on(idx, scripts[idx].func(io, socket, cluster)); }

    socket.on('disconnect', function (reason) { disconnectEvent(socket, cluster, reason); });
  });

  process.on('message', function (data) {
    console.log(data);
  });

  http.listen(5000, () => {
    startEvent(io);
    setInterval(updateEvent.func(io), updateEvent.delay);
  });
};
