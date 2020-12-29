import fs from 'fs';
import path from 'path';
import makeServer from './server.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default (port, callback = () => {}) => {
    const absoluteFileName = path.resolve(__dirname, './boxParameters.json');
    const data = fs.readFileSync(absoluteFileName, 'utf-8');
    const boxParameters = JSON.parse(data);

    const server = makeServer(boxParameters, port);
};