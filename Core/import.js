const fs = require('fs');
var scripts = {};
var identity = '@';

function importScripts (dir) {
  var ev = fs.readdirSync(dir);
  for (var i = 0; i < ev.length; i++) {
    if (ev[i].replace(/.*\./gi, '') === 'js' && ev[i].startsWith(identity)) {
      scripts[ev[i].split('.js')[0].split(identity)[1]] = require(`${dir}/${ev[i]}`);
    }

    if (ev[i].match(/.*\./gi) == null) { importScripts(`${dir}/${ev[i]}`); }
  }
}

module.exports = function (dir, ident) {
  scripts = {};
  identity = ident === undefined ? identity : ident;
  importScripts(dir);
  return scripts;
};
