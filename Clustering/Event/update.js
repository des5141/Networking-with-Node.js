module.exports = {
  delay: 5000,
  func: function (io) {
    return function () {
      for (var idx in io.sockets.sockets) {
        /* console.log(io.sockets.sockets[idx].nickname);
        console.log(io.sockets.sockets[idx].id); */
      }
    };
  }
};
