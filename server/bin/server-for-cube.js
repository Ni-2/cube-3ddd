import makeServer from '../index.js';
import cluster  from 'cluster';
import os from 'os';
const numCPUs = os.cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  makeServer(PORT);
}