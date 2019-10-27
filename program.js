const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_NONE; // 워커 스케쥴을 OS에 맡긴다

const master = require('./Modules/cluster/master.js'); // master preset
const worker = require('./Modules/cluster/worker.js'); // worker preset

if (cluster.isMaster) { master(cluster); } else { worker(cluster); }
