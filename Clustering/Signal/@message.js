module.exports = {
  func: function (io, socket) {
    return function (data) {
      console.log(__filename);
      console.log(socket.id);
      console.log(data + '\n');

      io.emit('rece', data);
    };
  }
};
