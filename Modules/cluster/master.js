const os = require('os');

function loop (func) {
  return function (count) {
    for (var i = 0; i < count; i++) { func(); }
  };
}

module.exports = function (cluster) {
  loop(cluster.fork)(os.cpus().length);
  cluster.on('exit', function () { cluster.fork(); });

  for (const id in cluster.workers) {
    const worker = cluster.workers[id];
    worker.on('message', function (message) {
      console.log('마스터가 ' + worker.process.pid + ' 워커로부터 받은 메시지 : ' + message);
    });
    worker.send('마스터가 보내는 메시지');
  }

  return 'master';
};
