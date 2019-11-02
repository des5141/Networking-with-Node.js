const dir = __dirname;
const redis = require('redis');
const redisClient = redis.createClient({ host: 'rhea31.duckdns.org' });
redisClient.set('wow', JSON.stringify({ asd: 'asd' }));
const cluster = require('cluster');
const scripts = require(`${dir}/Core/import.js`)(`${dir}/Signal`);
const master = require(`${dir}/Core/master.js`);
const worker = require(`${dir}/Core/worker.js`);

if (cluster.isMaster) { master(cluster); } else { worker(5000, cluster, scripts); }
