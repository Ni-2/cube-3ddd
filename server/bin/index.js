import makeServer from '../server';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

makeServer(PORT, isDev);
