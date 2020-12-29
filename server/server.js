import express from 'express';
import path from 'path';
import makeTriangulation from './makeTriangulation.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default (boxParameters) => {
    const app = express();

    // Priority serve any static files.
    app.use(express.static(path.resolve(__dirname, '../cube-ui/build')));

    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // Answer API requests.
    app.get('/api', (request, response) => {
        response.set('Content-Type', 'application/json');
        response.set('Access-Control-Allow-Methods', ['POST', 'GET']);

        response.status(200);
        const url = new URL(request.url, `http://${request.headers.host}`);
        const { set } = Object.fromEntries(url.searchParams);
        if (set === 'defaultParams') {
            const { defaultParameters } = boxParameters;
            boxParameters = { defaultParameters };
            response.json(boxParameters.defaultParameters);
        } else {
            response.json(boxParameters.usersParameters
                || boxParameters.defaultParameters);
        }
    });

    app.post('/api', (request, response) => {
        response.set('Content-Type', 'application/json');
        response.set('Access-Control-Allow-Methods', ['POST', 'GET']);

        const data = request.body;
        const parsedData = JSON.parse(Object.keys(data)[0]);
        const triangulation = makeTriangulation(parsedData);
        boxParameters.usersParameters = { ...parsedData, ...triangulation };

        response.status(201);
        response.json(boxParameters.usersParameters);

    });

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function(request, response) {
        response.sendFile(path.resolve(__dirname, '../cube-ui/build/index.html'));
    });

    return app;
};