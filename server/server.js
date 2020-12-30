import fs from 'fs';
import path from 'path';
import express from 'express';
import cluster  from 'cluster';

import os from 'os';
const numCPUs = os.cpus().length;

import makeTriangulation from './makeTriangulation.js';

const getServerTriangulationData = (absoluteFileName) => {
    const wetBoxParameters = fs.readFileSync(absoluteFileName, 'utf-8');
    return JSON.parse(wetBoxParameters);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (port, isDev) => {
    if (!isDev && cluster.isMaster) {

        // Multi-process to utilize all CPU cores.
        console.error(`Node cluster master ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
          console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
        });

    } else {
        const app = express();

        // Priority serve any static files.
        app.use(express.static(path.resolve(__dirname, '../cube-ui/build')));

        app.use(express.json()); // for parsing application/json
        app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

        // Get absolute name of json keeping users and default parameters
        const absoluteFileName = path.resolve(__dirname, '../boxParameters.json');

        // Answer API requests.
        app.get('/api', (request, response) => {
            const { defaultParameters, usersParameters } = getServerTriangulationData(absoluteFileName);

            response.set('Content-Type', 'application/json');
            response.set('Access-Control-Allow-Methods', ['POST', 'GET']);
            response.status(200);
    
            const url = new URL(request.url, `http://${request.headers.host}`);
            const { set } = Object.fromEntries(url.searchParams);
            if (set === 'defaultParams') {
                fs.writeFileSync(absoluteFileName, JSON.stringify({ defaultParameters }), 'utf-8');
                response.json(defaultParameters);
            } else {
                response.json(usersParameters || defaultParameters);
            }
        });

        app.post('/api', (request, response) => {
            const { defaultParameters } = getServerTriangulationData(absoluteFileName);

            response.set('Content-Type', 'application/json');
            response.set('Access-Control-Allow-Methods', ['POST', 'GET']);
            response.status(201);

            const data = request.body;
            const parsedData = JSON.parse(Object.keys(data)[0]);
            const triangulation = makeTriangulation(parsedData);
            const usersParameters = { ...parsedData, ...triangulation };
            fs.writeFileSync(absoluteFileName, JSON.stringify({ defaultParameters, usersParameters }), 'utf-8');
            response.json(usersParameters);
        });

        // All remaining requests return the React app, so it can handle routing.
        app.get('*', function(request, response) {
            response.sendFile(path.resolve(__dirname, '../cube-ui/build', 'index.html'));
        });

        app.listen(port, function () {
            console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${port}`);
        });
    }
};