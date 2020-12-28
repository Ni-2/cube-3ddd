import http from 'http';
import makeTriangulation from './makeTriangulation.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default (boxParameters) => http.createServer((request, response) => {
    const body = [];
    
    request
        .on('error', err => { console.error(err) })
        .on('data', (chunk) => body.push(chunk.toString()))
        .on('end', () => {
            response.on('error', err => {
                console.error(err);
            });

            response.setHeader('Content-Type', 'application/json');

            if (request.method === 'GET') {
                response.statusCode = 200;
                const url = new URL(request.url, `http://${request.headers.host}`);
                const { set } = Object.fromEntries(url.searchParams);
                if (set === 'defaultParams') {
                    const { defaultParameters } = boxParameters;
                    boxParameters = { defaultParameters };
                    response.end(JSON.stringify(boxParameters.defaultParameters));
                } else {
                    response.end(JSON.stringify(boxParameters.usersParameters
                        || boxParameters.defaultParameters));
                }
                return;
            }
            const data = JSON.parse(body);
            console.log(data);
            const triangulation = makeTriangulation(data);
            boxParameters.usersParameters = { ...data, ...triangulation };

            response.statusCode = 201;
            response.end(JSON.stringify(boxParameters.usersParameters));
        });

    request.resume();
});