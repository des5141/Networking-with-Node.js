module.exports = function (id, key) {
  process.send(JSON.stringify({
    signal: 0, // 0 is get data
    id: id,
    key: key
  }));
};
