const server = require('net').createServer();

module.exports = function (cluster) {
  process.on('message', function (message) {
    console.log('워커가 마스터에게 받은 메시지 : ' + message);
  });
  process.send(process.pid + ' pid 를 가진 워커가 마스터에게 보내는 메시지');

  server.on('error', function (err) { console.log('TCP crashed :\r\n', err.message); });
  server.on('connection', function (sock) { console.log('connected'); });
  server.on('listening', function () { console.log('starting'); });

  setTimeout(function () {
    server.listen('8080', '127.0.0.1');
  }, 1000);

  setTimeout(function () {
    process.exit(0);
  }, 2000);

  return 'worker';
};
