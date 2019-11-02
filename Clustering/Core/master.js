const cpus = require('os').cpus().length;

function loop (count) {
  return function (func) {
    for (var i = 0; i < count; i++) { func(); }
  };
}

module.exports = function (cluster) {
  loop(cpus)(cluster.fork);
  cluster.on('exit', function () { cluster.fork(); });
};
