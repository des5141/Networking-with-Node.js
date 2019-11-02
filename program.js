const dir = __dirname;
const cluster = require('cluster');
const scripts = require(`${dir}/Core/import.js`)(`${dir}/Signal`);
const master = require(`${dir}/Core/master.js`);
const worker = require(`${dir}/Core/worker.js`);

if (cluster.isMaster) { master(cluster); } else { worker(cluster, scripts); }
