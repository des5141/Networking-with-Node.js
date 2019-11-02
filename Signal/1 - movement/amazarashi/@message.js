module.exports = {
  func: function (io, socket) {
    return function (data) {
      console.log(__dirname);
      console.log(data);
      io.emit('rece', data);
      process.send('test');
    };
  }
};
