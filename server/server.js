import express from 'express';
import path from 'path';
import makeTriangulation from './makeTriangulation.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default (boxParameters) => {
    const app = express();

    // Priority serve any static files.
    app.use(express.static(path.resolve(process.cwd(), '../react-ui/build')));

    app.get((request, response) => {
        response.set('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5001');
        response.setHeader('Access-Control-Allow-Methods', ['POST', 'GET']);

        response.statusCode = 200;
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

    app.post((request, response) => {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5001');
        response.setHeader('Access-Control-Allow-Methods', ['POST', 'GET']);

        const data = JSON.parse(request.data);
        const triangulation = makeTriangulation(data);
        boxParameters.usersParameters = { ...data, ...triangulation };

        response.statusCode = 201;
        response.json(boxParameters.usersParameters);

    });

    return app;
};